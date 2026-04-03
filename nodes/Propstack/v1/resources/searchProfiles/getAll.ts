import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest, toInt } from "../../helpers";

const GETALL_FIELD_MAPPING: Record<string, string | ((v: unknown) => [string, unknown] | undefined)> = {
  clientId: toInt("client"),
};

function extractData(response: unknown): IDataObject[] {
  if (response && typeof response === "object" && "data" in (response as IDataObject)) {
    const data = (response as IDataObject).data;
    return Array.isArray(data) ? data as IDataObject[] : [];
  }
  return Array.isArray(response) ? response as IDataObject[] : [response as IDataObject];
}

export async function searchProfilesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const extraQs = buildQs(additionalFields, GETALL_FIELD_MAPPING);

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const qs: IDataObject = {
        page: currentPage,
        per: 100,
        ...extraQs,
      };

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.SEARCH_PROFILES_GET_ALL,
        qs,
      });

      const results = extractData(response);
      allResults = allResults.concat(results);

      if (results.length < 100) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }

    return this.helpers.returnJsonArray(allResults);
  }

  const qs: IDataObject = {
    page: 1,
    per: limit,
    ...extraQs,
  };

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.SEARCH_PROFILES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(extractData(response));
}
