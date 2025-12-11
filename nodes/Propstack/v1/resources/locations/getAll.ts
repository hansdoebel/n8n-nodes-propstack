import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export const locationsGetAllDescription: INodeProperties[] = [];

export async function locationsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.LOCATIONS_GET_ALL,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default locationsGetAllDescription;
