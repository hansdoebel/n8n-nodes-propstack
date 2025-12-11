import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import { customFieldFieldOptions, CF_DIRECT_FIELDS } from "./fields";

export const customFieldsCreateDescription: INodeProperties[] = [
  {
    displayName: "Custom Field Group ID",
    name: "customFieldGroupId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["customFields"], operation: ["create"] } },
  },
  {
    displayName: "Name",
    name: "fieldName",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["customFields"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["customFields"], operation: ["create"] } },
    options: customFieldFieldOptions,
  },
];

export async function customFieldsCreate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const body = buildBody.call(this, "additionalFields", CF_DIRECT_FIELDS);
  body.custom_field_group_id = this.getNodeParameter("customFieldGroupId", 0) as string;
  body.name = this.getNodeParameter("fieldName", 0) as string;

  const response = await propstackV2Request.call(this, { method: "POST", url: V2.CUSTOM_FIELDS, body });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
