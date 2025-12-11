import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest, simplifyResponse } from "../../helpers";

const PROJECTS_SIMPLIFIED_FIELDS = [
  "id", "name", "status", "street", "city",
  "postal_code", "created_at", "updated_at",
];

export const projectsGetDescription: INodeProperties[] = [];

export async function projectsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const projectId = extractResourceLocatorValue(
    this.getNodeParameter("projectId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROJECTS_GET(projectId),
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], PROJECTS_SIMPLIFIED_FIELDS) : data,
  );
}

export default projectsGetDescription;
