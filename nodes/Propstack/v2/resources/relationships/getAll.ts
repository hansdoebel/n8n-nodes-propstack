import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate } from "../../helpers";

const displayOptions = { operation: ["getAll"], resource: ["relationships"] };

export const relationshipsGetAllDescription: INodeProperties[] = [
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
      { displayName: "Client ID", name: "client_id", type: "string", default: "" },
      { displayName: "Internal Name", name: "internal_name", type: "string", default: "" },
      { displayName: "Project ID", name: "project_id", type: "string", default: "" },
      { displayName: "Property ID", name: "property_id", type: "string", default: "" },
    ],
  },
];

export async function relationshipsGetAll(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, {
    internal_name: "internal_name",
    property_id: "property_id",
    project_id: "project_id",
    client_id: "client_id",
  });
  return paginate.call(this, { url: V2.RELATIONSHIPS, qs, returnAll, limit });
}
