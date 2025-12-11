import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForContactsCreate = {
  operation: ["create"],
  resource: ["contacts"],
};

export const contactsCreateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForContactsCreate,
    },
    options: [
      {
        displayName: "City",
        name: "city",
        type: "string",
        default: "",
      },
      {
        displayName: "Company",
        name: "company",
        type: "string",
        default: "",
        description: "Company name",
      },
      {
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
        description: "Country code (ISO 3166-1 alpha-2)",
      },
      {
        displayName: "Custom Fields",
        name: "partial_custom_fields",
        type: "string",
        default: "",
        description: "Custom fields as JSON object",
      },
      {
        displayName: "Date of Birth",
        name: "date_of_birth",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "e.g. nathan@example.com",
        default: "",
        description: "Email address of the contact",
      },
      {
        displayName: "First Name",
        name: "first_name",
        type: "string",
        default: "",
        description: "First name of the contact",
      },
      {
        displayName: "GDPR Status",
        name: "gdpr_status",
        type: "options",
        default: 0,
        options: [
          { name: "Not Set", value: 0 },
          { name: "Accepted", value: 1 },
          { name: "Rejected", value: 2 },
          { name: "Withdrawn", value: 3 },
        ],
        description: "GDPR consent status",
      },
      {
        displayName: "Group IDs",
        name: "group_ids",
        type: "string",
        default: "",
        description:
          "Comma-separated list of group IDs to assign the contact to",
      },
      {
        displayName: "House Number",
        name: "house_number",
        type: "string",
        default: "",
      },
      {
        displayName: "Last Name",
        name: "last_name",
        type: "string",
        default: "",
        description: "Last name of the contact",
      },
      {
        displayName: "Mobile Phone",
        name: "mobile_phone",
        type: "string",
        default: "",
        description: "Mobile phone number",
      },
      {
        displayName: "Notes",
        name: "notes",
        type: "string",
        default: "",
        description: "Notes about the contact",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Phone Number",
        name: "phone_number",
        type: "string",
        default: "",
        description: "Primary phone number",
      },
      {
        displayName: "Position",
        name: "position",
        type: "string",
        default: "",
        description: "Position in the company",
      },
      {
        displayName: "Postal Code",
        name: "postal_code",
        type: "string",
        default: "",
      },
      {
        displayName: "Salutation",
        name: "salutation",
        type: "options",
        default: "mr",
        options: [
          { name: "Dr", value: "dr" },
          { name: "Mr", value: "mr" },
          { name: "Ms", value: "ms" },
          { name: "Mx", value: "mx" },
          { name: "Prof", value: "prof" },
        ],
        description: "Salutation for the contact",
      },
      {
        displayName: "Source",
        name: "source",
        type: "string",
        default: "",
        description: "Contact source/origin",
      },
      {
        displayName: "Status",
        name: "status",
        type: "string",
        default: "",
        description: "Contact status",
      },
      {
        displayName: "Street",
        name: "street",
        type: "string",
        default: "",
        description: "Street address",
      },
    ],
  },
];

function buildContactsCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "salutation",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "mobile_phone",
      "company",
      "position",
      "street",
      "house_number",
      "postal_code",
      "city",
      "country",
      "date_of_birth",
      "status",
      "source",
      "notes",
      "gdpr_status",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }

    if (options.group_ids) {
      body.group_ids = (options.group_ids as string)
        .split(",")
        .map((id) => id.trim());
    }

    if (options.partial_custom_fields) {
      try {
        body.partial_custom_fields = JSON.parse(
          options.partial_custom_fields as string,
        );
      } catch {
        body.partial_custom_fields = options.partial_custom_fields;
      }
    }
  }

  return body;
}

export async function contactsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildContactsCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.CONTACTS_CREATE,
    body: { client: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default contactsCreateDescription;
