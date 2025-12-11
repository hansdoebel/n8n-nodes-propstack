import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const dealsDeleteDescription: INodeProperties[] = [];

export async function dealsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const dealId = extractResourceLocatorValue(
    this.getNodeParameter("dealId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.DEALS_DELETE(dealId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default dealsDeleteDescription;
