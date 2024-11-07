import type { OpenAPIV3 } from 'openapi-types';
import type { Prop } from './props2String';
export type Parameter = {
    name: string;
    prop: string | Prop;
};
declare const _default: (params: OpenAPIV3.ComponentsObject["parameters"], openapi: OpenAPIV3.Document) => Parameter[] | undefined;
export default _default;
//# sourceMappingURL=parameters2Props.d.ts.map