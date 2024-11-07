"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
exports.default = (headers) => headers &&
    Object.keys(headers)
        .map((defKey) => {
        const target = headers[defKey];
        let value;
        if ((0, converters_1.isRefObject)(target)) {
            value = (0, converters_1.$ref2Type)(target.$ref);
        }
        else {
            const result = (0, converters_1.schema2value)(target.schema);
            if (!result)
                return null;
            value = { ...result, description: target.description ?? null };
        }
        return { name: (0, converters_1.defKey2defName)(defKey), value };
    })
        .filter((v) => !!v);
//# sourceMappingURL=headers2Props.js.map