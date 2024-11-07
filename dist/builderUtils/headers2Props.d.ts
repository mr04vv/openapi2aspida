import type { OpenAPIV3 } from 'openapi-types';
import type { PropValue } from './props2String';
export type Header = {
    name: string;
    value: string | PropValue;
};
declare const _default: (headers: OpenAPIV3.ComponentsObject["headers"]) => Header[] | undefined;
export default _default;
//# sourceMappingURL=headers2Props.d.ts.map