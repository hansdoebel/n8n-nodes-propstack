import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const teamsDeleteDescription: INodeProperties[] = [];

export async function teamsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const teamId = extractResourceLocatorValue(
    this.getNodeParameter("teamId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.TEAMS_DELETE(teamId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default teamsDeleteDescription;
