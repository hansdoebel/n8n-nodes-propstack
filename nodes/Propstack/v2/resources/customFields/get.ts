import type { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export async function customFieldsGet(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("customFieldId", 0));
  const response = await propstackV2Request.call(this, { method: "GET", url: V2.CUSTOM_FIELD(id) });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
