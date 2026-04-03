import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function featuresGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const entity = this.getNodeParameter("entity", 0) as string;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {
    entity,
  };

  if (options?.superGroupId) {
    qs.super_group = parseInt(options.superGroupId as string, 10);
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.FEATURES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
