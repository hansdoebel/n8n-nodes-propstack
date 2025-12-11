import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate, simplifyResponse } from "../../helpers";

const PROJECTS_SIMPLIFIED_FIELDS = [
  "id", "name", "status", "street", "city",
  "zip_code", "broker_id", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["getAll"],
  resource: ["projects"],
};

export const projectsGetAllDescription: INodeProperties[] = [
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
        displayName: "Project IDs",
        name: "project_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of project IDs",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
        type: "string",
        default: "",
      },
    ],
  },
];

export async function projectsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    order: "order",
    sort_by: "sort_by",
    project_ids: "project_ids",
  });

  const results = await paginate.call(this, {
    url: V2.PROJECTS,
    qs,
    returnAll,
    limit,
  });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], PROJECTS_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
