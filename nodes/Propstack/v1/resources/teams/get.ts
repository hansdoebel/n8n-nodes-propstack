import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const teamsGetDescription: INodeProperties[] = [];

export async function teamsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const teamId = extractResourceLocatorValue(
    this.getNodeParameter("teamId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TEAMS_GET(teamId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default teamsGetDescription;
