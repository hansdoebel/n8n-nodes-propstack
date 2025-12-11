import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, propstackV2Request } from "../../helpers";

const displayOptions = { operation: ["getAll"], resource: ["customFields"] };

export const customFieldsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
      { displayName: "Entity", name: "entity", type: "string", default: "" },
      { displayName: "Field Type", name: "field_type", type: "string", default: "" },
    ],
  },
];

export async function customFieldsGetAll(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, { entity: "entity", field_type: "field_type" });
  const response = await propstackV2Request.call(this, { method: "GET", url: V2.CUSTOM_FIELDS, qs });
  const data = Array.isArray(response) ? response : [response];
  return this.helpers.returnJsonArray(data);
}
