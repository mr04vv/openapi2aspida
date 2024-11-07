"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const buildV3_1 = __importDefault(require("./buildV3"));
const resolveExternalRefs_1 = __importDefault(require("./resolveExternalRefs"));
const isV3 = (openapi) => 'openapi' in openapi;
exports.default = async ({ input, isYaml }) => {
    const openapi = await swagger_parser_1.default.parse(input, { parse: { json: !isYaml } });
    const docs = isV3(openapi)
        ? openapi
        : await require('swagger2openapi').convertObj(openapi, { direct: true, resolveInternal: true });
    return (0, resolveExternalRefs_1.default)(docs, typeof input === 'string' ? input : '').then(buildV3_1.default);
};
//# sourceMappingURL=buildTemplate.js.map