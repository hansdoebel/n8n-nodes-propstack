import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export async function emailsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const emailId = extractResourceLocatorValue(
    this.getNodeParameter("emailId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.EMAILS_GET(emailId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
