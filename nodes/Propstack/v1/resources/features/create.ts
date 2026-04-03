import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export async function featuresCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body: IDataObject = {};

  body.entity = this.getNodeParameter("entity", 0) as string;
  body.name = this.getNodeParameter("name", 0) as string;

  const superGroupId = extractResourceLocatorValue(
    this.getNodeParameter("superGroupId", 0),
  );
  if (superGroupId) {
    body.super_group_id = parseInt(superGroupId, 10);
  }

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.FEATURES_CREATE,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
