import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function webhooksCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const targetUrl = this.getNodeParameter("targetUrl", 0) as string;
  const event = this.getNodeParameter("event", 0) as string;

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.WEBHOOKS_CREATE,
    body: {
      target_url: targetUrl,
      event,
    },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
