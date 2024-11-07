"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
const resolvers_1 = require("./resolvers");
exports.default = (params, openapi) => params &&
    Object.keys(params)
        .filter((defKey) => {
        const target = params[defKey];
        return !((0, converters_1.isRefObject)(target) ? (0, resolvers_1.resolveParamsRef)(openapi, target.$ref) : target).deprecated;
    })
        .map((defKey) => {
        const target = params[defKey];
        let prop;
        if ((0, converters_1.isRefObject)(target)) {
            prop = (0, converters_1.$ref2Type)(target.$ref);
        }
        else {
            const value = (0, converters_1.schema2value)(target.schema);
            if (!value)
                return null;
            prop = {
                name: (0, converters_1.getPropertyName)(target.name).replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
                required: target.required ?? false,
                description: target.description ?? null,
                values: [value],
            };
        }
        return { name: (0, converters_1.defKey2defName)(defKey), prop };
    })
        .filter((v) => !!v);
//# sourceMappingURL=parameters2Props.js.map