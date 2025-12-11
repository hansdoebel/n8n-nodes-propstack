import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export const reservationReasonsGetAllDescription: INodeProperties[] = [];

export async function reservationReasonsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.RESERVATION_REASONS_GET_ALL,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default reservationReasonsGetAllDescription;
