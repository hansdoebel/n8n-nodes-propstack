import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export const brokersGetAllDescription: INodeProperties[] = [];

export async function brokersGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.BROKERS_GET_ALL,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default brokersGetAllDescription;
