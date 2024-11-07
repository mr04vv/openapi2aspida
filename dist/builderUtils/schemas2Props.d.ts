import type { OpenAPIV3 } from 'openapi-types';
import type { PropValue } from './props2String';
export type Schema = {
    name: string;
    value: PropValue;
};
declare const _default: (schemas: OpenAPIV3.ComponentsObject["schemas"], openapi: OpenAPIV3.Document) => Schema[] | undefined;
export default _default;
//# sourceMappingURL=schemas2Props.d.ts.map