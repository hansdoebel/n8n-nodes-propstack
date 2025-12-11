import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const documentsDeleteDescription: INodeProperties[] = [];

export async function documentsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const documentId = extractResourceLocatorValue(
    this.getNodeParameter("documentId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.DOCUMENTS_DELETE(documentId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default documentsDeleteDescription;
