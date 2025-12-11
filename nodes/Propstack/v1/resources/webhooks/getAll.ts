import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function webhooksGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.WEBHOOKS_GET_ALL,
  });

  return [
    {
      json: response,
      pairedItem: { item: 0 },
    },
  ];
}
