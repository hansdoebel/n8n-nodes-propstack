import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const documentsGetDescription: INodeProperties[] = [];

export async function documentsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = extractResourceLocatorValue(
    this.getNodeParameter("documentId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DOCUMENTS_GET(documentId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentsGetDescription;
