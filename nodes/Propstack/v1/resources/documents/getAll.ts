import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest } from "../../helpers";

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
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;

  const page = (options?.page as number) || 1;

  const optionsQs = buildQs(options, {
    order_by: "order_by",
    tag: "tag",
    is_private: "is_private",
    client: "client",
    property: "property",
    project: "project",
    client_property: "client_property",
  });

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.DOCUMENTS_GET_ALL,
        qs: { page: currentPage, per: 100, ...optionsQs },
      });

      const body = response as IDataObject;
      const results = Array.isArray(body.documents) ? body.documents : [];
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
    url: API_ENDPOINTS.DOCUMENTS_GET_ALL,
    qs: { page, per: limit, ...optionsQs },
  });

  const body = response as IDataObject;
  const results = Array.isArray(body.documents) ? body.documents : [];
  return this.helpers.returnJsonArray(results);
}

export default documentsGetAllDescription;
