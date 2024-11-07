import type { OpenAPIV3 } from 'openapi-types';
import type { PropValue } from './props2String';
export type Response = {
    name: string;
    value: string | PropValue;
};
declare const _default: (bodies: OpenAPIV3.ComponentsObject["responses"]) => Response[] | undefined;
export default _default;
//# sourceMappingURL=responses2Props.d.ts.map