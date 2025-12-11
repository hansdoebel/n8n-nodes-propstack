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
  operation: ["getDeleted"],
  resource: ["clients"],
};

export const clientsGetDeletedDescription: INodeProperties[] = [
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
        displayName: "Deleted At From",
        name: "deleted_at_from",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Deleted At To",
        name: "deleted_at_to",
        type: "dateTime",
        default: "",
      },
    ],
  },
];

export async function clientsGetDeleted(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    deleted_at_from: "deleted_at_from",
    deleted_at_to: "deleted_at_to",
  });

  const results = await paginate.call(this, {
    url: V2.CLIENTS_DELETED,
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
