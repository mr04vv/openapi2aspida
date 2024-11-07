"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const getText = (url) => new Promise((resolve) => {
    (url.startsWith('https') ? https_1.default : http_1.default)
        .get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            resolve(body);
        });
    })
        .on('error', (e) => {
        console.log(`Could not get: ${url}\n`, e);
    });
});
const hasExternalRegExp = /"\$ref":"[^#].+?"/g;
const fetchExternalDocs = async (docs, inputDir) => {
    const docList = [];
    const fetchingUrls = [];
    const fetchDocs = (d, input) => Promise.all((JSON.stringify(d).match(hasExternalRegExp) ?? []).map(async (ref) => {
        const [, url] = ref.match(/"\$ref":"(.+?)[#"]/);
        if (fetchingUrls.includes(url))
            return;
        fetchingUrls.push(url);
        const filePath = url.startsWith('http') ? url : path_1.default.posix.join(path_1.default.dirname(input), url);
        const text = await (filePath.startsWith('http')
            ? getText(filePath)
            : fs_1.default.promises.readFile(filePath, 'utf8'));
        const doc = filePath.endsWith('.json') ? JSON.parse(text) : js_yaml_1.default.load(text);
        docList[fetchingUrls.indexOf(url)] = { url, doc };
        await fetchDocs(doc, filePath);
    }));
    await fetchDocs(docs, inputDir);
    return docList;
};
const getComponentInfo = (docList, url, prop) => {
    const data = docList.find((d) => d.url === url).doc;
    const target = prop ? prop.split('/').reduce((prev, current) => prev[current], data) : data;
    if (target.name)
        return { type: 'parameters', data: target };
    return { type: 'schemas', data: target };
};
const genExternalTypeName = (docList, url, prop) => `External${docList.findIndex((d) => d.url === url)}${prop ? `_${prop.split('/').pop()}` : ''}`;
const resolveExternalDocs = async (docs, inputDir) => {
    const externalDocs = await fetchExternalDocs(docs, inputDir);
    const componentsInfoList = [];
    const replacedExternalDocs = externalDocs.map((selfDoc) => {
        let docsString = JSON.stringify(selfDoc.doc);
        (docsString.match(/"\$ref":".+?"/g) ?? []).forEach((refs) => {
            const targetText = refs.replace('"$ref":"', '').slice(0, -1);
            const [urlBase, propBase = '/'] = targetText.split('#');
            const url = urlBase || selfDoc.url;
            const prop = propBase.slice(1);
            const info = getComponentInfo(externalDocs, url, prop);
            const name = genExternalTypeName(externalDocs, url, prop);
            docsString = docsString.replace(targetText, `#/components/${info.type}/${name}`);
            componentsInfoList.push({ url, prop, name });
        });
        return { url: selfDoc.url, doc: JSON.parse(docsString) };
    });
    return {
        externalDocs: replacedExternalDocs,
        components: componentsInfoList.reduce((prev, { url, prop, name }) => {
            const info = getComponentInfo(replacedExternalDocs, url, prop);
            return { ...prev, [info.type]: { ...prev[info.type], [name]: info.data } };
        }, {}),
    };
};
exports.default = async (docs, inputDir) => {
    const { externalDocs, components } = await resolveExternalDocs(docs, inputDir);
    let docsString = JSON.stringify(docs);
    (docsString.match(hasExternalRegExp) ?? []).forEach((refs) => {
        const targetText = refs.replace('"$ref":"', '').slice(0, -1);
        const [url, propBase = '/'] = targetText.split('#');
        const prop = propBase.slice(1);
        const info = getComponentInfo(externalDocs, url, prop);
        components[info.type] = components[info.type] || {};
        const name = genExternalTypeName(externalDocs, url, prop);
        Object.assign(components[info.type], { [name]: info.data });
        docsString = docsString.replace(targetText, `#/components/${info.type}/${name}`);
    });
    const resolved = JSON.parse(docsString);
    resolved.components = resolved.components || {};
    Object.keys(components).forEach((key) => {
        resolved.components[key] = {
            ...resolved.components[key],
            ...components[key],
        };
    });
    return resolved;
};
//# sourceMappingURL=resolveExternalRefs.js.map