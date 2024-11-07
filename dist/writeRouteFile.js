"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("aspida/dist/cjs/commands");
const fs_1 = __importDefault(require("fs"));
exports.default = ({ config, types, files, outputDir, }) => {
    if (types) {
        fs_1.default.mkdirSync(`${outputDir}/@types`);
        fs_1.default.writeFileSync(`${outputDir}/@types/index.ts`, types, 'utf8');
    }
    files.forEach((p) => {
        const fileName = p.file.pop();
        p.file.forEach((_d, i, dirList) => {
            const dirPath = `${outputDir}/${dirList.slice(0, i + 1).join('/')}`;
            if (!fs_1.default.existsSync(dirPath)) {
                fs_1.default.mkdirSync(dirPath);
            }
        });
        fs_1.default.writeFileSync(`${outputDir}/${p.file.join('/')}/${fileName}.ts`, p.methods, 'utf8');
    });
    const buildConfig = config;
    buildConfig.input = outputDir || config.input;
    (0, commands_1.build)(buildConfig);
};
//# sourceMappingURL=writeRouteFile.js.map