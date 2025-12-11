import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate, simplifyResponse } from "../../helpers";

const CLIENT_PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "client_id", "property_id", "deal_stage_id",
  "price", "status", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["getAll"],
  resource: ["clientProperties"],
};

export const clientPropertiesGetAllDescription: INodeProperties[] = [
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
    displayOptions: { show: { ...displayOptions, returnAll: [false] } },
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
        displayName: "Category",
        name: "category",
        type: "string",
        default: "",
      },
      {
        displayName: "Deal Pipeline ID",
        name: "deal_pipeline_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Deal Stage ID",
        name: "deal_stage_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Order",
        name: "order",
        type: "options",
        default: "desc",
        options: [
          { name: "Ascending", value: "asc" },
          { name: "Descending", value: "desc" },
        ],
      },
      {
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
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

export async function clientPropertiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    deal_pipeline_id: "deal_pipeline_id",
    deal_stage_id: "deal_stage_id",
    property_id: "property_id",
    category: "category",
    order: "order",
    sort_by: "sort_by",
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });

  const results = await paginate.call(this, {
    url: V2.CLIENT_PROPERTIES,
    qs,
    returnAll,
    limit,
  });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], CLIENT_PROPERTIES_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
