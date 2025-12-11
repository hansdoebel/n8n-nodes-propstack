import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate, simplifyResponse } from "../../helpers";

const BROKERS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "email", "created_at", "updated_at",
];

const displayOptions = { operation: ["getAll"], resource: ["brokers"] };

export const brokersGetAllDescription: INodeProperties[] = [
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
      { displayName: "Broker IDs", name: "broker_ids", type: "string", default: "", description: "Comma-separated list of broker IDs" },
      { displayName: "Email", name: "email", type: "string", default: "", placeholder: "name@email.com" },
    ],
  },
];

export async function brokersGetAll(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, { broker_ids: "broker_ids", email: "email" });
  const results = await paginate.call(this, { url: V2.BROKERS, qs, returnAll, limit });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], BROKERS_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
