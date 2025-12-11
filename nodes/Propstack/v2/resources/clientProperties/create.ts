import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { clientPropertyFieldOptions, CP_DIRECT_FIELDS, CP_CSV_FIELDS, CP_JSON_FIELDS } from "./fields";

export const clientPropertiesCreateDescription: INodeProperties[] = [
  {
    displayName: "Client",
    name: "clientId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    displayOptions: {
      show: { resource: ["clientProperties"], operation: ["create"] },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchClients",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 12345",
      },
    ],
  },
  {
    displayName: "Property",
    name: "propertyId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    displayOptions: {
      show: { resource: ["clientProperties"], operation: ["create"] },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchProperties",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 12345",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["clientProperties"], operation: ["create"] },
    },
    options: clientPropertyFieldOptions,
  },
];

export async function clientPropertiesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );

  const body = buildBody.call(this, "additionalFields", CP_DIRECT_FIELDS, CP_CSV_FIELDS, CP_JSON_FIELDS);
  body.client_id = clientId;
  body.property_id = propertyId;

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.CLIENT_PROPERTIES,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
