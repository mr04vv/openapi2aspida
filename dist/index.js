"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const buildTemplate_1 = __importDefault(require("./buildTemplate"));
const getConfig_1 = __importDefault(require("./getConfig"));
const writeRouteFile_1 = __importDefault(require("./writeRouteFile"));
exports.default = (configs) => {
    return (0, getConfig_1.default)(configs).map(async (config) => {
        const outputDir = config.output;
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        else if (fs_1.default.readdirSync(config.output).length) {
            console.log(`fatal: destination path '${outputDir}' is not an empty directory.`);
            return;
        }
        const { baseURL, types, files } = await (0, buildTemplate_1.default)(config);
        (0, writeRouteFile_1.default)({
            config: {
                input: config.output,
                baseURL,
                outputMode: config.outputMode,
                outputEachDir: config.outputEachDir,
                trailingSlash: config.trailingSlash,
            },
            types,
            files,
            outputDir,
        });
    });
};
//# sourceMappingURL=index.js.map