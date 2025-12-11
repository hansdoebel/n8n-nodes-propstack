import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request, simplifyResponse } from "../../helpers";

const BROKERS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "email", "created_at", "updated_at",
];

export async function brokersGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("brokerId", 0));
  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.BROKER(id),
  });
  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], BROKERS_SIMPLIFIED_FIELDS) : data,
  );
}
