"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
const resolvers_1 = require("./resolvers");
exports.default = (schemas, openapi) => schemas &&
    Object.keys(schemas)
        .filter((defKey) => {
        const target = schemas[defKey];
        return !((0, converters_1.isRefObject)(target) ? (0, resolvers_1.resolveSchemasRef)(openapi, target.$ref) : target).deprecated;
    })
        .map((defKey) => {
        const value = (0, converters_1.schema2value)(schemas[defKey]);
        return value ? { name: (0, converters_1.defKey2defName)(defKey), value } : null;
    })
        .filter((v) => !!v);
//# sourceMappingURL=schemas2Props.js.map