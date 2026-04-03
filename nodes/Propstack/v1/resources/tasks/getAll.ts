import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

function buildFilterQs(filters: IDataObject): IDataObject {
  const qs: IDataObject = {};
  const filterKeys: Record<string, string> = {
    client_id: "filter[client_id]",
    property_id: "filter[property_id]",
    project_id: "filter[project_id]",
    is_reminder: "filter[is_reminder]",
    is_event: "filter[is_event]",
    done: "filter[done]",
  };

  for (const [field, qsKey] of Object.entries(filterKeys)) {
    if (filters[field] !== undefined && filters[field] !== "") {
      qs[qsKey] = filters[field];
    }
  }

  return qs;
}

export async function tasksGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0, false) as boolean;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildFilterQs(filters);

  if (!returnAll) {
    qs.limit = this.getNodeParameter("limit", 0, 50) as number;
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TASKS_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
