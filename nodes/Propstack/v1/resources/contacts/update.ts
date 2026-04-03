import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, extractResourceLocatorValue, parseJson, propstackRequest, splitCsv } from "../../helpers";

const showForContactsUpdate = {
  operation: ["update"],
  resource: ["contacts"],
};

export const contactsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForContactsUpdate,
    },
    options: [
      {
        displayName: "Add Group IDs",
        name: "add_group_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of group IDs to add to the contact",
      },
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
          "Comma-separated list of group IDs to replace all existing groups",
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
        displayName: "Remove Group IDs",
        name: "sub_group_ids",
        type: "string",
        default: "",
        description:
          "Comma-separated list of group IDs to remove from the contact",
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

const CONTACT_BODY_MAPPING: Record<string, string> = {
  salutation: "salutation",
  first_name: "first_name",
  last_name: "last_name",
  email: "email",
  phone_number: "phone_number",
  mobile_phone: "mobile_phone",
  company: "company",
  position: "position",
  street: "street",
  house_number: "house_number",
  postal_code: "postal_code",
  city: "city",
  country: "country",
  date_of_birth: "date_of_birth",
  status: "status",
  source: "source",
  notes: "notes",
  gdpr_status: "gdpr_status",
};

export async function contactsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const contactId = extractResourceLocatorValue(
    this.getNodeParameter("contactId", 0),
  );
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body = buildQs(options, {
    ...CONTACT_BODY_MAPPING,
    group_ids: splitCsv("group_ids"),
    add_group_ids: splitCsv("add_group_ids"),
    sub_group_ids: splitCsv("sub_group_ids"),
    partial_custom_fields: parseJson("partial_custom_fields"),
  });

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.CONTACTS_UPDATE(contactId),
    body: { client: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default contactsUpdateDescription;
