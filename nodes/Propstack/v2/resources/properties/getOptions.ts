import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, propstackV2Request, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "rs_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "zip_code", "status", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["getOptions"],
  resource: ["properties"],
};

export const propertiesGetOptionsDescription: INodeProperties[] = [
  {
    displayName: "Fields",
    name: "fields",
    type: "string",
    default: "",
    displayOptions: { show: displayOptions },
    description: "Comma-separated list of fields to return options for",
  },
  {
    displayName: "Locale",
    name: "locale",
    type: "string",
    default: "",
    displayOptions: { show: displayOptions },
    description: "Language code (e.g. de, en)",
  },
];

export async function propertiesGetOptions(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const fields = this.getNodeParameter("fields", 0, "") as string;
  const locale = this.getNodeParameter("locale", 0, "") as string;

  const qs = buildQs({ fields, locale } as IDataObject, {
    fields: "fields",
    locale: "locale",
  });

  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.PROPERTIES_OPTIONS,
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}
