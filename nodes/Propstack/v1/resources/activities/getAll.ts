import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest } from "../../helpers";

const splitIds =
  (key: string) =>
  (v: unknown): [string, unknown] => [key, (v as string).split(",").map((id) => id.trim())];

export async function activitiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 20) as number;
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;

  const optionsQs = buildQs(options, {
    broker_id: "broker_id",
    creator_id: "creator_id",
    expand: "expand",
    item_type: "item_type",
    not_completed: "not_completed",
    order: "order",
    client_ids: splitIds("client_ids"),
    project_ids: splitIds("project_ids"),
    property_ids: splitIds("property_ids"),
    reason_ids: splitIds("reason_ids"),
    starts_at_from: "starts_at_from",
    starts_at_to: "starts_at_to",
  });

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.ACTIVITIES_GET_ALL,
        qs: { page: currentPage, per: 100, ...optionsQs },
      });

      const body = response as IDataObject;
      const results = Array.isArray(body.data) ? body.data : [];
      allResults = allResults.concat(results);

      if (results.length < 100) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }

    return this.helpers.returnJsonArray(allResults);
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.ACTIVITIES_GET_ALL,
    qs: { page: 1, per: limit, ...optionsQs },
  });

  const body = response as IDataObject;
  const results = Array.isArray(body.data) ? body.data : [];
  return this.helpers.returnJsonArray(results);
}
