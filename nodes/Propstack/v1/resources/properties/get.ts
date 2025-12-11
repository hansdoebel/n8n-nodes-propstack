import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "object_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "postal_code", "status", "created_at", "updated_at",
];

const showForPropertiesGet = {
  operation: ["get"],
  resource: ["properties"],
};

export const propertiesGetDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForPropertiesGet,
    },
    options: [
      {
        displayName: "New Format",
        name: "new",
        type: "boolean",
        default: true,
        description:
          "Whether to use new response format with broker, project, documents, floorplans, and images",
      },
      {
        displayName: "Include Translations",
        name: "include_translations",
        type: "string",
        default: "",
        description:
          'Language codes for translations (comma-separated, e.g., "en,de")',
      },
    ],
  },
];

export async function propertiesGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {};

  if (options) {
    if (options.new !== false) {
      qs.new = 1;
    }
    if (options.include_translations) {
      qs.include_translations = options.include_translations;
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROPERTIES_GET(propertyId),
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}

export default propertiesGetDescription;
