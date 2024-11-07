import type { OpenAPIV3 } from 'openapi-types';
import type { PropValue } from './props2String';
export type RequestBody = {
    name: string;
    value: string | PropValue;
};
declare const _default: (bodies: OpenAPIV3.ComponentsObject["requestBodies"]) => RequestBody[] | undefined;
export default _default;
//# sourceMappingURL=requestBodies2Props.d.ts.map