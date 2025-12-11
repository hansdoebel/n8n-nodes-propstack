import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest, simplifyResponse } from "../../helpers";

const CONTACTS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "email", "phone_number",
  "company", "status", "created_at", "updated_at",
];

const showForContactsGet = {
  operation: ["get"],
  resource: ["contacts"],
};

export const contactsGetDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForContactsGet,
    },
    options: [
      {
        displayName: "Expand",
        name: "expand",
        type: "boolean",
        default: false,
        description: "Whether to return detailed JSON with custom fields",
      },
      {
        displayName: "Include Children",
        name: "include_children",
        type: "boolean",
        default: false,
        description: "Whether to include child contacts",
      },
      {
        displayName: "Include Documents",
        name: "include_documents",
        type: "boolean",
        default: false,
        description: "Whether to include documents",
      },
      {
        displayName: "Include Owned Properties",
        name: "include_owned_properties",
        type: "boolean",
        default: false,
        description: "Whether to include owned properties",
      },
      {
        displayName: "Include Relationships",
        name: "include_relationships",
        type: "boolean",
        default: false,
        description: "Whether to include relationships",
      },
    ],
  },
];

export async function contactsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const contactId = extractResourceLocatorValue(
    this.getNodeParameter("contactId", 0),
  );
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {};

  if (options) {
    if (options.expand) qs.expand = options.expand;
    if (options.include_children) {
      qs.include_children = options.include_children;
    }
    if (options.include_documents) {
      qs.include_documents = options.include_documents;
    }
    if (options.include_relationships) {
      qs.include_relationships = options.include_relationships;
    }
    if (options.include_owned_properties) {
      qs.include_owned_properties = options.include_owned_properties;
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.CONTACTS_GET(contactId),
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, CONTACTS_SIMPLIFIED_FIELDS) : data,
  );
}

export default contactsGetDescription;
