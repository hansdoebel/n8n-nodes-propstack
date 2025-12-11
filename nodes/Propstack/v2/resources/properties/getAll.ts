import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "rs_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "zip_code", "status", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["getAll"],
  resource: ["properties"],
};

export const propertiesGetAllDescription: INodeProperties[] = [
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
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
      },
      {
        displayName: "Exact",
        name: "exact",
        type: "boolean",
        default: false,
        description: "Whether to use exact matching for the search query",
      },
      {
        displayName: "Fields",
        name: "fields",
        type: "string",
        default: "",
        description: "Comma-separated list of fields to return",
      },
      {
        displayName: "Group",
        name: "group",
        type: "string",
        default: "",
      },
      {
        displayName: "Marketing Type",
        name: "marketing_type",
        type: "string",
        default: "",
      },
      {
        displayName: "Order",
        name: "order",
        type: "options",
        default: "asc",
        options: [
          { name: "Ascending", value: "asc" },
          { name: "Descending", value: "desc" },
        ],
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
      },
      {
        displayName: "RS Type",
        name: "rs_type",
        type: "string",
        default: "",
      },
      {
        displayName: "Search Query",
        name: "q",
        type: "string",
        default: "",
        description: "Full-text search query",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
        type: "string",
        default: "",
      },
      {
        displayName: "Status",
        name: "status",
        type: "string",
        default: "",
      },
      {
        displayName: "Updated At From",
        name: "updated_at_from",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Updated At To",
        name: "updated_at_to",
        type: "dateTime",
        default: "",
      },
    ],
  },
];

export async function propertiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    q: "q",
    status: "status",
    fields: "fields",
    country: "country",
    project_id: "project_id",
    marketing_type: "marketing_type",
    rs_type: "rs_type",
    order: "order",
    sort_by: "sort_by",
    exact: "exact",
    group: "group",
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });

  const results = await paginate.call(this, {
    url: V2.PROPERTIES,
    qs,
    returnAll,
    limit,
  });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], PROPERTIES_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
