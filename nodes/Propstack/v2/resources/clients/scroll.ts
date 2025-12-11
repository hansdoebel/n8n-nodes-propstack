import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, scrollAll, simplifyResponse } from "../../helpers";

const CLIENTS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "company", "emails",
  "phone", "client_status_id", "broker_id", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["scroll"],
  resource: ["clients"],
};

export const clientsScrollDescription: INodeProperties[] = [
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
        displayName: "Include Children",
        name: "include_children",
        type: "boolean",
        default: false,
        description: "Whether to include child contacts",
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

export async function clientsScroll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    fields: "fields",
    include_children: "include_children",
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });

  const results = await scrollAll.call(this, { url: V2.CLIENTS_SCROLL, qs });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], CLIENTS_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
