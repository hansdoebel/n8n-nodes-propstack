import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { customFieldFieldOptions, CF_DIRECT_FIELDS } from "./fields";

export const customFieldsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["customFields"], operation: ["update"] } },
    options: [
      { displayName: "Custom Field Group ID", name: "custom_field_group_id", type: "string", default: "" },
      { displayName: "Name", name: "name", type: "string", default: "" },
      ...customFieldFieldOptions,
    ],
  },
];

export async function customFieldsUpdate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("customFieldId", 0));
  const body = buildBody.call(this, "additionalFields", [...CF_DIRECT_FIELDS, "custom_field_group_id", "name"]);
  const response = await propstackV2Request.call(this, { method: "PUT", url: V2.CUSTOM_FIELD(id), body });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
