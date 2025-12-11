import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForDocumentsGetAll = {
  operation: ["getAll"],
  resource: ["documents"],
};

export const documentsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForDocumentsGetAll,
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
        ...showForDocumentsGetAll,
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
      show: showForDocumentsGetAll,
    },
    options: [
      {
        displayName: "Client ID",
        name: "client",
        type: "string",
        default: "",
        description: "Filter by associated contact ID",
      },
      {
        displayName: "Deal ID",
        name: "client_property",
        type: "string",
        default: "",
        description: "Filter by associated deal ID",
      },
      {
        displayName: "Is Private",
        name: "is_private",
        type: "boolean",
        default: false,
        description: "Whether to filter by privacy status",
      },
      {
        displayName: "Order By",
        name: "order_by",
        type: "string",
        default: "position,asc",
        description: 'Sort results (e.g., "position,asc" or "created_at,desc")',
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
      {
        displayName: "Project ID",
        name: "project",
        type: "string",
        default: "",
        description: "Filter by associated project ID",
      },
      {
        displayName: "Property ID",
        name: "property",
        type: "string",
        default: "",
        description: "Filter by associated property ID",
      },
      {
        displayName: "Tag",
        name: "tag",
        type: "string",
        default: "",
        description: "Filter by document tag",
      },
    ],
  },
];

export async function documentsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const page = (options?.page as number) || 1;

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const qs: IDataObject = {
        page: currentPage,
        per_page: 100,
      };

      if (options) {
        if (options.order_by) qs.order_by = options.order_by;
        if (options.tag) qs.tag = options.tag;
        if (
          options.is_private !== undefined &&
          options.is_private !== ""
        ) {
          qs.is_private = options.is_private;
        }
        if (options.client) qs.client = options.client;
        if (options.property) qs.property = options.property;
        if (options.project) qs.project = options.project;
        if (options.client_property) {
          qs.client_property = options.client_property;
        }
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.DOCUMENTS_GET_ALL,
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
    page,
    per_page: limit,
  };

  if (options) {
    if (options.order_by) qs.order_by = options.order_by;
    if (options.tag) qs.tag = options.tag;
    if (
      options.is_private !== undefined &&
      options.is_private !== ""
    ) {
      qs.is_private = options.is_private;
    }
    if (options.client) qs.client = options.client;
    if (options.property) qs.property = options.property;
    if (options.project) qs.project = options.project;
    if (options.client_property) {
      qs.client_property = options.client_property;
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DOCUMENTS_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentsGetAllDescription;
