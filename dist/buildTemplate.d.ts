import type { OpenAPIV3 } from 'openapi-types';
import type { Config } from './getConfig';
declare const _default: ({ input, isYaml }: Config) => Promise<{
    openapi: OpenAPIV3.Document<{}>;
    baseURL: string;
    types: string | null;
    files: {
        file: string[];
        methods: string;
    }[];
}>;
export default _default;
//# sourceMappingURL=buildTemplate.d.ts.map