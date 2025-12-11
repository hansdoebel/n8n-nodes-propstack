import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export async function customFieldsDelete(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("customFieldId", 0));
  await propstackV2Request.call(this, { method: "DELETE", url: V2.CUSTOM_FIELD(id) });
  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
