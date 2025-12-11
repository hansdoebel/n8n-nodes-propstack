import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const propertiesDeleteDescription: INodeProperties[] = [];

export async function propertiesDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.PROPERTIES_DELETE(propertyId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default propertiesDeleteDescription;
