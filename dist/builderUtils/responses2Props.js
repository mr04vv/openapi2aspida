"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converters_1 = require("./converters");
exports.default = (bodies) => bodies &&
    Object.keys(bodies)
        .map((defKey) => {
        const target = bodies[defKey];
        let value;
        if ((0, converters_1.isRefObject)(target)) {
            value = (0, converters_1.$ref2Type)(target.$ref);
        }
        else {
            const content = target.content &&
                Object.entries(target.content).find(([key]) => key.startsWith('application/'))?.[1];
            if (!content)
                return null;
            const result = (0, converters_1.schema2value)(content.schema);
            if (!result)
                return null;
            value = result;
        }
        return { name: (0, converters_1.defKey2defName)(defKey), value };
    })
        .filter((v) => !!v);
//# sourceMappingURL=responses2Props.js.map