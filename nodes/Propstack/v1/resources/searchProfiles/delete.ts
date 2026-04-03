import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export async function searchProfilesDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const profileId = extractResourceLocatorValue(
    this.getNodeParameter("profileId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.SEARCH_PROFILES_DELETE(profileId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
