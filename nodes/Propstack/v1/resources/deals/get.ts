import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest, simplifyResponse } from "../../helpers";

const DEALS_SIMPLIFIED_FIELDS = [
  "id", "client_id", "property_id", "deal_stage_id",
  "price", "status", "created_at", "updated_at",
];

const showForDealsGet = {
  operation: ["get"],
  resource: ["deals"],
};

export const dealsGetDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDealsGet,
    },
    options: [
      {
        displayName: "Include",
        name: "include",
        type: "multiOptions",
        default: [],
        options: [
          { name: "Client", value: "client" },
          { name: "Property", value: "property" },
        ],
        description: "Associated entities to include in response",
      },
    ],
  },
];

export async function dealsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const dealId = extractResourceLocatorValue(
    this.getNodeParameter("dealId", 0),
  );
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {};

  if (options) {
    if (options.include) {
      qs.include = (options.include as string[]).join(",");
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DEALS_GET(dealId),
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, DEALS_SIMPLIFIED_FIELDS) : data,
  );
}

export default dealsGetDescription;
