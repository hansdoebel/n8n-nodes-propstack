import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function featuresParentGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const entity = this.getNodeParameter("entity", 0) as string;
  const includeGroups = this.getNodeParameter("includeGroups", 0) as boolean;

  const qs: IDataObject = {
    entity,
  };

  if (includeGroups) {
    qs.include = "groups";
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.FEATURES_PARENT_GET_ALL,
    qs,
  });

  const body = response as IDataObject;
  const data = Array.isArray(body.data) ? body.data : Array.isArray(response) ? response : [response];

  return this.helpers.returnJsonArray(data);
}
