import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const contactsDeleteDescription: INodeProperties[] = [];

export async function contactsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const contactId = extractResourceLocatorValue(
    this.getNodeParameter("contactId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.CONTACTS_DELETE(contactId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default contactsDeleteDescription;
