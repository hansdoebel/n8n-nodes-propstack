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
  propertyFieldOptions,
  PROPERTY_DIRECT_FIELDS,
  PROPERTY_CSV_FIELDS,
  PROPERTY_JSON_FIELDS,
} from "./fields";

export const propertiesUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["properties"],
        operation: ["update"],
      },
    },
    options: propertyFieldOptions,
  },
];

export async function propertiesUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );

  const body = buildBody.call(
    this,
    "additionalFields",
    PROPERTY_DIRECT_FIELDS,
    PROPERTY_CSV_FIELDS,
    PROPERTY_JSON_FIELDS,
  );

  const response = await propstackV2Request.call(this, {
    method: "PUT",
    url: V2.PROPERTY(propertyId),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
