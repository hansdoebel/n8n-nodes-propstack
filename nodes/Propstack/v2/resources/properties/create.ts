import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import {
  propertyFieldOptions,
  PROPERTY_DIRECT_FIELDS,
  PROPERTY_CSV_FIELDS,
  PROPERTY_JSON_FIELDS,
} from "./fields";

const displayOptions = {
  operation: ["create"],
  resource: ["properties"],
};

export const propertiesCreateDescription: INodeProperties[] = [
  {
    displayName: "Marketing Type",
    name: "marketingType",
    type: "options",
    required: true,
    default: "BUY",
    displayOptions: { show: displayOptions },
    options: [
      { name: "Buy", value: "BUY" },
      { name: "Rent", value: "RENT" },
    ],
  },
  {
    displayName: "Object Type",
    name: "objectType",
    type: "options",
    required: true,
    default: "APARTMENT",
    displayOptions: { show: displayOptions },
    options: [
      { name: "Apartment", value: "APARTMENT" },
      { name: "Flat Share Room", value: "FLAT_SHARE_ROOM" },
      { name: "Garage", value: "GARAGE" },
      { name: "Gastronomy", value: "GASTRONOMY" },
      { name: "House", value: "HOUSE" },
      { name: "Industry", value: "INDUSTRY" },
      { name: "Investment", value: "INVESTMENT" },
      { name: "Office", value: "OFFICE" },
      { name: "Short-Term Accommodation", value: "SHORT_TERM_ACCOMODATION" },
      { name: "Special Purpose", value: "SPECIAL_PURPOSE" },
      { name: "Store", value: "STORE" },
      { name: "Trade Site", value: "TRADE_SITE" },
    ],
  },
  {
    displayName: "RS Type",
    name: "rsType",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: displayOptions },
  },
  {
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: displayOptions },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: displayOptions },
    options: propertyFieldOptions,
  },
];

export async function propertiesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const marketingType = this.getNodeParameter("marketingType", 0) as string;
  const objectType = this.getNodeParameter("objectType", 0) as string;
  const rsType = this.getNodeParameter("rsType", 0) as string;
  const title = this.getNodeParameter("title", 0) as string;

  const body: IDataObject = {
    marketing_type: marketingType,
    object_type: objectType,
    rs_type: rsType,
    title,
  };

  const additionalBody = buildBody.call(
    this,
    "additionalFields",
    PROPERTY_DIRECT_FIELDS,
    PROPERTY_CSV_FIELDS,
    PROPERTY_JSON_FIELDS,
  );

  Object.assign(body, additionalBody);

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.PROPERTIES,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
