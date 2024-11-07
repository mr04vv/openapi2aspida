"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
const resolvers_1 = require("./resolvers");
exports.default = (text, params, openapi) => {
    if (text === '*')
        return '_any';
    if (!/^{/.test(text))
        return text;
    const valName = text.slice(1, -1);
    const prefix = `_${(0, converters_1.getPropertyName)(valName)}`;
    const schema = params.find((p) => p.in === 'path' && p.name === valName)?.schema;
    if (!schema)
        return prefix;
    if ((0, converters_1.isRefObject)(schema)) {
        const referencedSchema = (0, resolvers_1.resolveSchemasRef)(openapi, schema.$ref);
        if (referencedSchema.type === 'string') {
            return `${prefix}@string`;
        }
        else if (referencedSchema.type === 'number' || referencedSchema.type === 'integer') {
            return `${prefix}@number`;
        }
        else {
            return prefix;
        }
    }
    return `${prefix}${schema.type === 'string'
        ? '@string'
        : schema.type === 'number' || schema.type === 'integer'
            ? '@number'
            : ''}`;
};
//# sourceMappingURL=getDirName.js.map