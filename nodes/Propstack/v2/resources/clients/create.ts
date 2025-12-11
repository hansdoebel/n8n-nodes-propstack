import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import {
  clientFieldOptions,
  CLIENT_DIRECT_FIELDS,
  CLIENT_CSV_FIELDS,
  CLIENT_JSON_FIELDS,
} from "./fields";

export const clientsCreateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["clients"],
        operation: ["create"],
      },
    },
    options: clientFieldOptions,
  },
];

export async function clientsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildBody.call(
    this,
    "additionalFields",
    CLIENT_DIRECT_FIELDS,
    CLIENT_CSV_FIELDS,
    CLIENT_JSON_FIELDS,
  );

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.CLIENTS,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
