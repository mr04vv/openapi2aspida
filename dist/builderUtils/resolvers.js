"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReqRef = exports.resolveResRef = exports.resolveSchemasRef = exports.resolveParamsRef = void 0;
const converters_1 = require("./converters");
const resolveParamsRef = (openapi, ref) => {
    const target = openapi.components.parameters[(0, converters_1.$ref2TypeName)(ref).typeName];
    return (0, converters_1.isRefObject)(target) ? (0, exports.resolveParamsRef)(openapi, target.$ref) : target;
};
exports.resolveParamsRef = resolveParamsRef;
const resolveSchemasRef = (openapi, ref) => {
    const { typeName, propName } = (0, converters_1.$ref2TypeName)(ref);
    let target = openapi.components.schemas[typeName];
    target = !(0, converters_1.isRefObject)(target) && propName ? target.properties[propName] : target;
    return (0, converters_1.isRefObject)(target) ? (0, exports.resolveSchemasRef)(openapi, target.$ref) : target;
};
exports.resolveSchemasRef = resolveSchemasRef;
const resolveResRef = (openapi, ref) => {
    const target = openapi.components.responses[(0, converters_1.$ref2TypeName)(ref).typeName];
    return (0, converters_1.isRefObject)(target) ? (0, exports.resolveResRef)(openapi, target.$ref) : target;
};
exports.resolveResRef = resolveResRef;
const resolveReqRef = (openapi, ref) => {
    const target = openapi.components.requestBodies[(0, converters_1.$ref2TypeName)(ref).typeName];
    return (0, converters_1.isRefObject)(target) ? (0, exports.resolveReqRef)(openapi, target.$ref) : target;
};
exports.resolveReqRef = resolveReqRef;
//# sourceMappingURL=resolvers.js.map