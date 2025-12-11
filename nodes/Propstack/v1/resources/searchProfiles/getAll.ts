import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForSearchProfilesGetAll = {
  operation: ["getAll"],
  resource: ["searchProfiles"],
};

export const searchProfilesGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForSearchProfilesGetAll,
    },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    displayOptions: {
      show: {
        ...showForSearchProfilesGetAll,
        returnAll: [false],
      },
    },
    description: "Max number of results to return",
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForSearchProfilesGetAll,
    },
    options: [
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "",
        description: "Filter by contact ID",
      },
    ],
  },
];

export async function searchProfilesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const qs: IDataObject = {
        page: currentPage,
        per: 100,
      };

      if (options?.clientId) {
        qs.client = parseInt(options.clientId as string, 10);
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.SEARCH_PROFILES_GET_ALL,
        qs,
      });

      const results = Array.isArray(response) ? response : [response];
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
  };

  if (options?.clientId) {
    qs.client = parseInt(options.clientId as string, 10);
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.SEARCH_PROFILES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default searchProfilesGetAllDescription;
