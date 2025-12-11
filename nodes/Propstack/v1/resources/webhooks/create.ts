import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function webhooksCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const targetUrl = this.getNodeParameter("targetUrl", 0) as string;
  const event = this.getNodeParameter("event", 0) as string;

  const body = {
    target_url: targetUrl,
    event,
  };

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.WEBHOOKS_CREATE,
    body,
  });

  return [
    {
      json: response,
      pairedItem: { item: 0 },
    },
  ];
}
