"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema2value = exports.BINARY_TYPE = exports.getPropertyName = exports.isObjectSchema = exports.isRefObject = exports.$ref2Type = exports.$ref2TypeName = exports.defKey2defName = void 0;
const defKey2defName = (key) => `${key[0].replace(/^([^a-zA-Z$_])$/, '$$$1').toUpperCase()}${key
    .slice(1)
    .replace(/[^a-zA-Z0-9$_]/g, '_')}`;
exports.defKey2defName = defKey2defName;
const $ref2TypeName = (ref) => {
    const [, , , typeName, , propName] = ref.split('/');
    return { typeName, propName: propName || null };
};
exports.$ref2TypeName = $ref2TypeName;
// $ref2Type: replace /Array$/ for Swagger 2.0
const $ref2Type = (ref) => {
    const { typeName, propName } = (0, exports.$ref2TypeName)(ref);
    return `Types.${(0, exports.defKey2defName)(typeName)}${propName ? `['${propName}']` : ''}`.replace(/Array$/, '[]');
};
exports.$ref2Type = $ref2Type;
const isRefObject = (params) => '$ref' in params;
exports.isRefObject = isRefObject;
const isArraySchema = (schema) => schema.type === 'array';
const isObjectSchema = (schema) => !(0, exports.isRefObject)(schema) && schema.type !== 'array';
exports.isObjectSchema = isObjectSchema;
const getPropertyName = (name) => /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name) ? name : `'${name}'`;
exports.getPropertyName = getPropertyName;
const of2Values = (obj) => {
    const values = (obj.oneOf || obj.allOf || obj.anyOf || [])
        .map((p) => (0, exports.schema2value)(p))
        .filter(Boolean);
    return values.length ? values : null;
};
const object2value = (obj) => {
    const properties = obj.properties ?? {};
    const value = Object.keys(properties)
        .filter((name) => {
        const target = properties[name];
        return (0, exports.isRefObject)(target) || !target.deprecated;
    })
        .map((name) => {
        const val = (0, exports.schema2value)(properties[name]);
        if (!val)
            return null;
        return {
            name: (0, exports.getPropertyName)(name).replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
            required: obj.required?.includes(name) ?? false,
            description: val.description,
            values: [val],
        };
    })
        .filter((v) => v);
    const additionalProps = obj.additionalProperties;
    if (additionalProps) {
        const val = additionalProps === true
            ? {
                isArray: false,
                isEnum: false,
                nullable: false,
                description: null,
                value: 'any',
            }
            : (0, exports.schema2value)(additionalProps);
        if (val)
            value.push({
                name: '[key: string]',
                required: true,
                description: val.description,
                values: [val],
            });
    }
    return value;
};
exports.BINARY_TYPE = '(File | ReadStream)';
const schema2value = (schema, isResponse) => {
    if (!schema)
        return null;
    let isArray = false;
    let isEnum = false;
    let nullable = false;
    let hasOf;
    let value = null;
    let description = null;
    if ((0, exports.isRefObject)(schema)) {
        value = (0, exports.$ref2Type)(schema.$ref);
    }
    else {
        nullable = !!schema.nullable;
        description = schema.description ?? null;
        if (schema.oneOf || schema.allOf || schema.anyOf) {
            hasOf = schema.oneOf ? 'oneOf' : schema.allOf ? 'allOf' : 'anyOf';
            value = of2Values(schema);
        }
        else if (schema.enum) {
            isEnum = true;
            value = schema.type === 'string' ? schema.enum.map((e) => `'${e}'`) : schema.enum;
        }
        else if (isArraySchema(schema)) {
            isArray = true;
            value = (0, exports.schema2value)(schema.items);
        }
        else if (schema.properties || schema.additionalProperties) {
            value = object2value(schema);
        }
        else if (schema.format === 'binary') {
            value = isResponse ? 'Blob' : exports.BINARY_TYPE;
        }
        else if (schema.type !== 'object') {
            value = schema.type
                ? {
                    integer: 'number',
                    number: 'number',
                    null: 'null',
                    string: 'string',
                    boolean: 'boolean',
                }[schema.type]
                : null;
        }
    }
    return value ? { isArray, isEnum, nullable, hasOf, value, description } : null;
};
exports.schema2value = schema2value;
//# sourceMappingURL=converters.js.map