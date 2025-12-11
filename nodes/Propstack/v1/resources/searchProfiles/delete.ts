import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForSearchProfilesDelete = {
  operation: ["delete"],
  resource: ["searchProfiles"],
};

export const searchProfilesDeleteDescription: INodeProperties[] = [
  {
    displayName: "Search Profile ID",
    name: "profileId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForSearchProfilesDelete,
    },
    description: "The ID of the search profile to delete",
  },
];

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

export default searchProfilesDeleteDescription;
