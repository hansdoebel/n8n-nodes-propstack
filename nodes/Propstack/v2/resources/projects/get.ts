import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request, simplifyResponse } from "../../helpers";

const PROJECTS_SIMPLIFIED_FIELDS = [
  "id", "name", "status", "street", "city",
  "zip_code", "broker_id", "created_at", "updated_at",
];

export async function projectsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("projectId", 0),
  );
  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.PROJECT(id),
  });
  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], PROJECTS_SIMPLIFIED_FIELDS) : data,
  );
}
