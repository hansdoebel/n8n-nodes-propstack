import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { propstackRequest } from "../../helpers";
import { API_ENDPOINTS } from "../../constants";

export async function tasksGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0, false) as boolean;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs: IDataObject = {};

  if (filters.client_id) {
    qs["filter[client_id]"] = filters.client_id;
  }
  if (filters.property_id) {
    qs["filter[property_id]"] = filters.property_id;
  }
  if (filters.project_id) {
    qs["filter[project_id]"] = filters.project_id;
  }
  if (filters.is_reminder !== undefined) {
    qs["filter[is_reminder]"] = filters.is_reminder;
  }
  if (filters.is_event !== undefined) {
    qs["filter[is_event]"] = filters.is_event;
  }
  if (filters.done !== undefined) {
    qs["filter[done]"] = filters.done;
  }

  if (returnAll) {
    const response = await propstackRequest.call(this, {
      method: "GET",
      url: API_ENDPOINTS.TASKS_GET_ALL,
      qs,
    });
    return this.helpers.returnJsonArray(
      Array.isArray(response) ? response : [response],
    );
  } else {
    const limit = this.getNodeParameter("limit", 0, 50) as number;
    qs.limit = limit;

    const response = await propstackRequest.call(this, {
      method: "GET",
      url: API_ENDPOINTS.TASKS_GET_ALL,
      qs,
    });
    return this.helpers.returnJsonArray(
      Array.isArray(response) ? response : [response],
    );
  }
}
