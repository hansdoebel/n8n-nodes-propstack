import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, paginate } from "../../helpers";

const displayOptions = { operation: ["getAll"], resource: ["snippets"] };

export const snippetsGetAllDescription: INodeProperties[] = [
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
      { displayName: "For Broker", name: "for_broker", type: "boolean", default: false, description: "Whether to filter snippets assigned to a broker" },
    ],
  },
];

export async function snippetsGetAll(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, { for_broker: "for_broker" });
  return paginate.call(this, { url: V2.SNIPPETS, qs, returnAll, limit });
}
