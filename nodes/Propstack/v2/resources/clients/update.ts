import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import {
  buildBody,
  extractResourceLocatorValue,
  propstackV2Request,
} from "../../helpers";
import {
  clientFieldOptions,
  CLIENT_DIRECT_FIELDS,
  CLIENT_CSV_FIELDS,
  CLIENT_JSON_FIELDS,
} from "./fields";

export const clientsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["clients"],
        operation: ["update"],
      },
    },
    options: clientFieldOptions,
  },
];

export async function clientsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );

  const body = buildBody.call(
    this,
    "additionalFields",
    CLIENT_DIRECT_FIELDS,
    CLIENT_CSV_FIELDS,
    CLIENT_JSON_FIELDS,
  );

  const response = await propstackV2Request.call(this, {
    method: "PUT",
    url: V2.CLIENT(clientId),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
