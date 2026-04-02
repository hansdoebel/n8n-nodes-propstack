import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForEmailsGetAll = {
  operation: ["getAll"],
  resource: ["emails"],
};

export const emailsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForEmailsGetAll,
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
        ...showForEmailsGetAll,
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
      show: showForEmailsGetAll,
    },
    options: [
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

export async function emailsGetAll(
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
        per: 100,
      };

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.EMAILS_GET_ALL,
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
    per: limit,
  };

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.EMAILS_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default emailsGetAllDescription;
