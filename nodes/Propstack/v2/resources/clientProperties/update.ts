import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { clientPropertyFieldOptions, CP_DIRECT_FIELDS, CP_CSV_FIELDS, CP_JSON_FIELDS } from "./fields";

export const clientPropertiesUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["clientProperties"], operation: ["update"] },
    },
    options: [
      {
        displayName: "Client ID",
        name: "client_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
      },
      ...clientPropertyFieldOptions,
    ],
  },
];

export async function clientPropertiesUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("clientPropertyId", 0),
  );

  const body = buildBody.call(
    this,
    "additionalFields",
    [...CP_DIRECT_FIELDS, "client_id", "property_id"],
    CP_CSV_FIELDS,
    CP_JSON_FIELDS,
  );

  const response = await propstackV2Request.call(this, {
    method: "PUT",
    url: V2.CLIENT_PROPERTY(id),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
