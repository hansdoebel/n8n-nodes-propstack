import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

export async function teamsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.TEAMS_GET_ALL,
        qs: { page: currentPage, per: 100 },
      });

      const results = Array.isArray(response) ? response : [response];
      allResults = allResults.concat(results);
      hasMore = results.length >= 100;
      currentPage++;
    }

    return this.helpers.returnJsonArray(allResults);
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TEAMS_GET_ALL,
    qs: { page: 1, per: limit },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
