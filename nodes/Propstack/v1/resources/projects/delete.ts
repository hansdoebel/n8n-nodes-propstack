import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const projectsDeleteDescription: INodeProperties[] = [];

export async function projectsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const projectId = extractResourceLocatorValue(
    this.getNodeParameter("projectId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.PROJECTS_DELETE(projectId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}

export default projectsDeleteDescription;
