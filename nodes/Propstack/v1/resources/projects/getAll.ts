import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest, simplifyResponse } from "../../helpers";

const PROJECTS_SIMPLIFIED_FIELDS = [
  "id", "name", "status", "street", "city",
  "postal_code", "created_at", "updated_at",
];

const showForProjectsGetAll = {
  operation: ["getAll"],
  resource: ["projects"],
};

export const projectsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForProjectsGetAll,
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
        ...showForProjectsGetAll,
        returnAll: [false],
      },
    },
    description: "Max number of results to return",
    typeOptions: {
      minValue: 1,
      maxValue: 500,
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForProjectsGetAll,
    },
    options: [
      {
        displayName: "Expand",
        name: "expand",
        type: "boolean",
        default: false,
        description: "Whether to return extended data",
      },
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        description: "Page number for pagination",
        typeOptions: {
          minValue: 1,
        },
      },
    ],
  },
];

function buildGetAllQs(options: IDataObject): IDataObject {
  const qs: IDataObject = {};
  if (options?.expand) {
    qs.expand = 1;
  }
  return qs;
}

export async function projectsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;

  const baseQs = buildGetAllQs(options);

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.PROJECTS_GET_ALL,
        qs: { ...baseQs, page: currentPage, per: 100 },
      });

      const results = Array.isArray(response) ? response : [response];
      allResults = allResults.concat(results);
      hasMore = results.length >= 100;
      currentPage++;
    }

    return this.helpers.returnJsonArray(
      simplify ? simplifyResponse(allResults, PROJECTS_SIMPLIFIED_FIELDS) : allResults,
    );
  }

  const page = (options?.page as number) || 1;

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROJECTS_GET_ALL,
    qs: { ...baseQs, page, per: limit },
  });

  const data = Array.isArray(response) ? response : [response];
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, PROJECTS_SIMPLIFIED_FIELDS) : data,
  );
}
