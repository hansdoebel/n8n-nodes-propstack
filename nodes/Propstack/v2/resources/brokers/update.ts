import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { brokerFieldOptions, BROKER_DIRECT_FIELDS, BROKER_CSV_FIELDS, BROKER_JSON_FIELDS } from "./fields";

export const brokersUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["brokers"], operation: ["update"] } },
    options: brokerFieldOptions,
  },
];

export async function brokersUpdate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("brokerId", 0));
  const body = buildBody.call(this, "additionalFields", BROKER_DIRECT_FIELDS, BROKER_CSV_FIELDS, BROKER_JSON_FIELDS);
  const response = await propstackV2Request.call(this, { method: "PUT", url: V2.BROKER(id), body });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
