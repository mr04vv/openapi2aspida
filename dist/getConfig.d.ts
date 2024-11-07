import type { AspidaConfig } from 'aspida/dist/cjs/commands';
import type { OpenAPI } from 'openapi-types';
export type Config = Pick<AspidaConfig, 'outputEachDir' | 'outputMode' | 'trailingSlash'> & {
    input: string | OpenAPI.Document;
    output: string;
    isYaml: boolean;
};
export type ConfigFile = AspidaConfig & {
    openapi?: {
        inputFile: string;
        yaml?: boolean;
        outputDir?: string;
    };
};
export type PartialConfig = Partial<ConfigFile> | Partial<ConfigFile>[];
declare const _default: (config?: PartialConfig) => Config[];
export default _default;
//# sourceMappingURL=getConfig.d.ts.map