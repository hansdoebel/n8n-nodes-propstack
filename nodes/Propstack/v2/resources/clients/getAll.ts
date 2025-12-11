import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate, simplifyResponse } from "../../helpers";

const CLIENTS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "company", "emails",
  "phone", "client_status_id", "broker_id", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["getAll"],
  resource: ["clients"],
};

export const clientsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: { show: displayOptions },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    displayOptions: {
      show: { ...displayOptions, returnAll: [false] },
    },
    description: "Max number of results to return",
    typeOptions: { minValue: 1, maxValue: 100 },
  },
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
      {
        displayName: "Fields",
        name: "fields",
        type: "string",
        default: "",
        description: "Comma-separated list of fields to return",
      },
      {
        displayName: "Phone Number",
        name: "phone_number",
        type: "string",
        default: "",
        description: "Filter by phone number",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of property IDs",
      },
      {
        displayName: "Search Query",
        name: "q",
        type: "string",
        default: "",
        description: "Full-text search query",
      },
      {
        displayName: "Updated At From",
        name: "updated_at_from",
        type: "dateTime",
        default: "",
        description: "Filter by earliest updated_at (ISO date)",
      },
      {
        displayName: "Updated At To",
        name: "updated_at_to",
        type: "dateTime",
        default: "",
        description: "Filter by latest updated_at (ISO date)",
      },
    ],
  },
];

export async function clientsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    q: "q",
    phone_number: "phone_number",
    fields: "fields",
    property_ids: "property_ids",
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });

  const results = await paginate.call(this, {
    url: V2.CLIENTS,
    qs,
    returnAll,
    limit,
  });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], CLIENTS_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
