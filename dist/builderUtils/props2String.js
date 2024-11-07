"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props2String = exports.description2Doc = exports.value2String = void 0;
const array2String = (val, indent) => {
    const hasMulti = ((val.isEnum || val.hasOf) && Array.isArray(val.value) && val.value.length) || val.nullable;
    return `${hasMulti ? '(' : ''}${(0, exports.value2String)(val, indent)}${hasMulti ? ')' : ''}[]`;
};
const value2String = (v, indent) => `${v.hasOf
    ? values2String(v.value, v.hasOf, indent)
    : v.isArray
        ? array2String(v.value, indent)
        : v.isEnum
            ? v.value.join(' | ')
            : Array.isArray(v.value)
                ? (0, exports.props2String)(v.value, `  ${indent}`)
                : v.value}${v.nullable ? ' | null' : ''}`;
exports.value2String = value2String;
const values2String = (values, hasOf, indent) => values
    .map((a) => (0, exports.value2String)(a, indent))
    .join(hasOf === 'oneOf' || hasOf === 'anyOf' ? ' | ' : ' & ');
const isMultiLine = (values) => values.find((v) => !v.isEnum && Array.isArray(v.value));
const escapeDecription = (desc) => {
    return desc.replace(/\*\//g, '* /');
};
const description2Doc = (desc, indent) => {
    if (!desc)
        return '';
    const rows = desc.trim().split('\n').map(escapeDecription);
    return rows.length === 1
        ? `${indent}/** ${rows[0]} */\n`
        : `${indent}/**\n${indent} * ${rows.join(`\n${indent} * `)}\n${indent} */\n`;
};
exports.description2Doc = description2Doc;
const props2String = (props, indent) => `{\n${props
    .map((p, i) => {
    const opt = !p.required;
    return `${(0, exports.description2Doc)(p.description, `  ${indent}`)}  ${indent}${p.name}${opt ? '?' : ''}: ${values2String(p.values, undefined, indent)}${opt ? ' | undefined' : ''};${props.length - 1 === i || isMultiLine(p.values) || isMultiLine(props[i + 1].values)
        ? '\n'
        : ''}`;
})
    .join('\n')}${indent}}`;
exports.props2String = props2String;
//# sourceMappingURL=props2String.js.map