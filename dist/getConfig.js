"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("aspida/dist/cjs/commands");
const createConfig = (config) => {
    const openapi = config.openapi;
    return {
        input: openapi.inputFile,
        output: openapi.outputDir ?? config.input,
        trailingSlash: config.trailingSlash,
        outputEachDir: config.outputEachDir,
        outputMode: config.outputMode,
        isYaml: openapi.yaml ?? !openapi.inputFile.endsWith('.json'),
    };
};
exports.default = (config) => {
    const ReturnValue = (0, commands_1.getConfigs)(config)
        .filter((c) => c.openapi)
        .map(createConfig);
    return ReturnValue;
};
//# sourceMappingURL=getConfig.js.map