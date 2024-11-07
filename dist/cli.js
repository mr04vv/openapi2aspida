"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const getConfigs_1 = require("aspida/dist/cjs/getConfigs");
const minimist_1 = __importDefault(require("minimist"));
const _1 = __importDefault(require("."));
const run = (args) => {
    const argv = (0, minimist_1.default)(args, {
        string: ['version', 'input', 'config'],
        alias: { v: 'version', i: 'input', c: 'config', o: 'outputdir' },
    });
    if (argv.version !== undefined) {
        console.log(`v${require('../package.json').version}`);
        return;
    }
    const configs = (0, getConfigs_1.getConfigs)(argv.config);
    if (configs.length > 1) {
        (0, _1.default)(configs);
        return;
    }
    const config = configs[0];
    const inputFile = argv.input ?? config.openapi?.inputFile;
    if (!inputFile)
        return;
    (0, _1.default)({
        ...config,
        openapi: {
            ...config.openapi,
            inputFile,
            outputDir: argv.outputdir ?? config.openapi?.outputDir,
        },
    });
};
exports.run = run;
//# sourceMappingURL=cli.js.map