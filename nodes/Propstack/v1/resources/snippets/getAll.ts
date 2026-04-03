import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest, simplifyResponse } from "../../helpers";

const SNIPPETS_SIMPLIFIED_FIELDS = [
  "id", "name", "subject", "message_category_id",
  "snippet_category_id", "message_template_id",
];

export async function snippetsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.SNIPPETS_GET_ALL,
  });

  let data = Array.isArray(response) ? response : [response];

  if (!returnAll) {
    data = data.slice(0, limit);
  }

  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], SNIPPETS_SIMPLIFIED_FIELDS) : data,
  );
}
