import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function webhooksGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.WEBHOOKS_GET_ALL,
  });

  const body = response as IDataObject;
  const data = Array.isArray(body.hooks)
    ? body.hooks
    : Array.isArray(response)
      ? response
      : [response];

  return this.helpers.returnJsonArray(data);
}
