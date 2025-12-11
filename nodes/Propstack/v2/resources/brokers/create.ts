import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import { brokerFieldOptions, BROKER_DIRECT_FIELDS, BROKER_CSV_FIELDS, BROKER_JSON_FIELDS } from "./fields";

export const brokersCreateDescription: INodeProperties[] = [
  {
    displayName: "Email",
    name: "email",
    type: "string",
    placeholder: "e.g. nathan@example.com",
    default: "",
    displayOptions: { show: { resource: ["brokers"], operation: ["create"] } },
  },
  {
    displayName: "Role",
    name: "role",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["brokers"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["brokers"], operation: ["create"] } },
    options: brokerFieldOptions,
  },
];

export async function brokersCreate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const body = buildBody.call(this, "additionalFields", BROKER_DIRECT_FIELDS, BROKER_CSV_FIELDS, BROKER_JSON_FIELDS);
  body.role = this.getNodeParameter("role", 0) as string;
  const email = this.getNodeParameter("email", 0) as string;
  if (email) body.email = email;

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.BROKERS,
    body,
  });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
