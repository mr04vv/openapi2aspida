"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./builderUtils/converters");
const getDirName_1 = __importDefault(require("./builderUtils/getDirName"));
const headers2Props_1 = __importDefault(require("./builderUtils/headers2Props"));
const parameters2Props_1 = __importDefault(require("./builderUtils/parameters2Props"));
const props2String_1 = require("./builderUtils/props2String");
const requestBodies2Props_1 = __importDefault(require("./builderUtils/requestBodies2Props"));
const resolvers_1 = require("./builderUtils/resolvers");
const responses2Props_1 = __importDefault(require("./builderUtils/responses2Props"));
const schemas2Props_1 = __importDefault(require("./builderUtils/schemas2Props"));
const methodNames = ['get', 'post', 'put', 'delete', 'head', 'options', 'patch'];
const getParamsList = (openapi, params) => params?.map((p) => ((0, converters_1.isRefObject)(p) ? (0, resolvers_1.resolveParamsRef)(openapi, p.$ref) : p)) || [];
exports.default = (openapi) => {
    const files = [];
    const schemas = (0, schemas2Props_1.default)(openapi.components?.schemas, openapi) || [];
    const parameters = (0, parameters2Props_1.default)(openapi.components?.parameters, openapi) || [];
    const requestBodies = (0, requestBodies2Props_1.default)(openapi.components?.requestBodies) || [];
    const responses = (0, responses2Props_1.default)(openapi.components?.responses) || [];
    const headers = (0, headers2Props_1.default)(openapi.components?.headers) || [];
    files.push(...Object.keys(openapi.paths)
        .map((path) => {
        const methodProps = Object.keys(openapi.paths[path]).filter((method) => methodNames.includes(method));
        const file = [
            ...path
                .replace(/\/$/, '')
                .split('/')
                .slice(1)
                .map((p) => (0, getDirName_1.default)(p, [
                ...getParamsList(openapi, openapi.paths[path].parameters),
                ...methodProps.reduce((prev, c) => [
                    ...prev,
                    ...getParamsList(openapi, openapi.paths[path][c]?.parameters),
                ], []),
            ], openapi)),
            'index',
        ];
        const methods = methodProps
            .map((method) => {
            const target = openapi.paths[path][method];
            if (target.deprecated)
                return null;
            const params = [];
            if (target.parameters || openapi.paths[path].parameters) {
                const reqRefHeaders = [];
                const reqHeaders = [];
                const refQuery = [];
                const query = [];
                let queryRequired = false;
                [...(openapi.paths[path].parameters || []), ...(target.parameters || [])].forEach((p) => {
                    if ((0, converters_1.isRefObject)(p)) {
                        const ref = (0, resolvers_1.resolveParamsRef)(openapi, p.$ref);
                        const val = {
                            isArray: false,
                            isEnum: false,
                            nullable: false,
                            description: ref.description ?? null,
                            value: (0, converters_1.$ref2Type)(p.$ref),
                        };
                        switch (ref.in) {
                            case 'header':
                                reqRefHeaders.push(val);
                                break;
                            case 'query':
                                refQuery.push(val);
                                queryRequired = queryRequired || (ref.required ?? false);
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        const value = (0, converters_1.schema2value)(p.schema);
                        if (!value)
                            return;
                        const prop = {
                            name: (0, converters_1.getPropertyName)(p.name).replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
                            required: p.required ?? false,
                            description: p.description ?? null,
                            values: [value],
                        };
                        switch (p.in) {
                            case 'header':
                                reqHeaders.push(prop);
                                break;
                            case 'query':
                                query.push(prop);
                                queryRequired = queryRequired || (p.required ?? false);
                                break;
                            default:
                                break;
                        }
                    }
                });
                if (reqHeaders.length || reqRefHeaders.length) {
                    params.push({
                        name: 'reqHeaders',
                        required: false,
                        description: null,
                        values: [
                            ...reqRefHeaders,
                            ...(reqHeaders.length
                                ? [
                                    {
                                        isArray: false,
                                        isEnum: false,
                                        nullable: false,
                                        description: null,
                                        value: reqHeaders,
                                    },
                                ]
                                : []),
                        ],
                    });
                }
                if (refQuery.length || query.length) {
                    params.push({
                        name: 'query',
                        required: queryRequired,
                        description: null,
                        values: [
                            ...refQuery,
                            ...(query.length
                                ? [
                                    {
                                        isArray: false,
                                        isEnum: false,
                                        nullable: false,
                                        description: null,
                                        value: query,
                                    },
                                ]
                                : []),
                        ],
                    });
                }
            }
            if (target.responses) {
                const code = Object.keys(target.responses).find((code) => code.match(/^(20\d|30\d)$/));
                if (code) {
                    params.push({
                        name: 'status',
                        required: true,
                        description: null,
                        values: [
                            {
                                isArray: false,
                                isEnum: false,
                                nullable: false,
                                description: null,
                                value: code,
                            },
                        ],
                    });
                    const res = target.responses[code];
                    const ref = (0, converters_1.isRefObject)(res) ? (0, resolvers_1.resolveResRef)(openapi, res.$ref) : res;
                    const content = (ref.content &&
                        Object.entries(ref.content).find(([key]) => key.startsWith('application/'))?.[1]) ??
                        ref.content?.[Object.keys(ref.content)[0]];
                    if (content?.schema) {
                        const val = (0, converters_1.schema2value)(content.schema, true);
                        if (val !== null) {
                            params.push({
                                name: 'resBody',
                                required: true,
                                description: ref.description,
                                values: [val],
                            });
                        }
                    }
                    if (ref.headers) {
                        params.push({
                            name: 'resHeaders',
                            required: true,
                            description: null,
                            values: [
                                {
                                    isArray: false,
                                    isEnum: false,
                                    nullable: false,
                                    description: null,
                                    value: Object.keys(ref.headers)
                                        .map((header) => {
                                        const headerData = ref.headers[header];
                                        const val = (0, converters_1.isRefObject)(headerData)
                                            ? {
                                                isArray: false,
                                                isEnum: false,
                                                description: null,
                                                value: (0, converters_1.$ref2Type)(headerData.$ref),
                                            }
                                            : (0, converters_1.schema2value)(headerData.schema);
                                        return (val && {
                                            name: (0, converters_1.getPropertyName)(header),
                                            required: (0, converters_1.isRefObject)(headerData)
                                                ? true
                                                : (headerData.required ?? true),
                                            description: (0, converters_1.isRefObject)(headerData)
                                                ? null
                                                : headerData.description,
                                            values: [val],
                                        });
                                    })
                                        .filter((v) => !!v),
                                },
                            ],
                        });
                    }
                }
            }
            if (target.requestBody) {
                let reqFormat = '';
                let reqBody = null;
                let required = true;
                let description = null;
                if ((0, converters_1.isRefObject)(target.requestBody)) {
                    const ref = (0, resolvers_1.resolveReqRef)(openapi, target.requestBody.$ref);
                    if (ref.content['multipart/form-data']?.schema) {
                        reqFormat = 'FormData';
                    }
                    else if (ref.content['application/x-www-form-urlencoded']?.schema) {
                        reqFormat = 'URLSearchParams';
                    }
                    reqBody = {
                        isArray: false,
                        isEnum: false,
                        nullable: false,
                        description: null,
                        value: (0, converters_1.$ref2Type)(target.requestBody.$ref),
                    };
                    required = ref.required ?? true;
                    description = ref.description ?? null;
                }
                else {
                    required = target.requestBody.required ?? true;
                    description = target.requestBody.description ?? null;
                    if (target.requestBody.content['multipart/form-data']?.schema) {
                        reqFormat = 'FormData';
                        reqBody = (0, converters_1.schema2value)(target.requestBody.content['multipart/form-data'].schema);
                    }
                    else if (target.requestBody.content['application/x-www-form-urlencoded']?.schema) {
                        reqFormat = 'URLSearchParams';
                        reqBody = (0, converters_1.schema2value)(target.requestBody.content['application/x-www-form-urlencoded'].schema);
                    }
                    else {
                        const content = target.requestBody.content &&
                            Object.entries(target.requestBody.content).find(([key]) => key.startsWith('application/'))?.[1];
                        if (content?.schema)
                            reqBody = (0, converters_1.schema2value)(content.schema);
                    }
                }
                if (reqFormat) {
                    params.push({
                        name: 'reqFormat',
                        required: true,
                        description: null,
                        values: [
                            {
                                isArray: false,
                                isEnum: false,
                                nullable: false,
                                description: null,
                                value: reqFormat,
                            },
                        ],
                    });
                }
                if (reqBody) {
                    params.push({
                        name: 'reqBody',
                        required,
                        description,
                        values: [reqBody],
                    });
                }
            }
            return {
                name: method,
                required: true,
                description: target.description ?? null,
                values: [
                    {
                        isArray: false,
                        isEnum: false,
                        nullable: false,
                        description: null,
                        value: params,
                    },
                ],
            };
        })
            .filter((method) => !!method);
        if (methods.length) {
            const methodsText = (0, props2String_1.props2String)(methods, '');
            const hasBinary = methodsText.includes(converters_1.BINARY_TYPE);
            const hasTypes = /( |<)Types\./.test(methodsText);
            return {
                file,
                methods: `/* eslint-disable */\nimport type { DefineMethods } from 'aspida';\n${hasBinary ? "import type { ReadStream } from 'fs';\n" : ''}${hasTypes
                    ? `import type * as Types from '${file.map(() => '').join('../')}@types';\n`
                    : ''}\nexport type Methods = DefineMethods<${methodsText}>;\n`,
            };
        }
        else {
            return { file, methods: '' };
        }
    })
        .filter((file) => file.methods));
    const typesText = parameters.length + schemas.length + requestBodies.length + responses.length + headers.length
        ? [
            ...parameters.map((p) => ({
                name: p.name,
                description: null,
                text: typeof p.prop === 'string' ? p.prop : (0, props2String_1.props2String)([p.prop], ''),
            })),
            ...schemas.map((s) => ({
                name: s.name,
                description: s.value.description,
                text: (0, props2String_1.value2String)(s.value, '').replace(/\n {2}/g, '\n'),
            })),
            ...requestBodies.map((r) => ({
                name: r.name,
                description: null,
                text: typeof r.value === 'string'
                    ? r.value
                    : (0, props2String_1.value2String)(r.value, '').replace(/\n {2}/g, '\n'),
            })),
            ...responses.map((r) => ({
                name: r.name,
                description: null,
                text: typeof r.value === 'string'
                    ? r.value
                    : (0, props2String_1.value2String)(r.value, '').replace(/\n {2}/g, '\n'),
            })),
            ...headers.map((h) => ({
                name: h.name,
                description: typeof h.value === 'string' ? null : h.value.description,
                text: typeof h.value === 'string'
                    ? h.value
                    : (0, props2String_1.value2String)(h.value, '').replace(/\n {2}/g, '\n'),
            })),
        ]
            .map((p) => `\n${(0, props2String_1.description2Doc)(p.description, '')}export type ${p.name} = ${p.text}\n`)
            .join('')
            .replace(/(\W)Types\./g, '$1')
            .replace(/\]\?:/g, ']:')
        : null;
    return {
        openapi, // for api-types
        baseURL: openapi.servers?.[0]?.url || '',
        types: typesText &&
            `/* eslint-disable */${typesText.includes(converters_1.BINARY_TYPE) ? "\nimport type { ReadStream } from 'fs'\n" : ''}${typesText}`,
        files,
    };
};
//# sourceMappingURL=buildV3.js.map