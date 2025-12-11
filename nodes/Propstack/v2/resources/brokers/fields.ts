import type { INodeProperties } from "n8n-workflow";

export const brokerFieldOptions: INodeProperties[] = [
  {
    displayName: "Cell",
    name: "cell",
    type: "string",
    default: "",
  },
  {
    displayName: "Custom Fields",
    name: "partial_custom_fields",
    type: "string",
    default: "",
    description: "Custom fields as JSON object",
  },
  {
    displayName: "First Name",
    name: "first_name",
    type: "string",
    default: "",
  },
  {
    displayName: "Last Name",
    name: "last_name",
    type: "string",
    default: "",
  },
  {
    displayName: "Phone",
    name: "phone",
    type: "string",
    default: "",
  },
  {
    displayName: "Position",
    name: "position",
    type: "string",
    default: "",
  },
  {
    displayName: "Salutation",
    name: "salutation",
    type: "string",
    default: "",
  },
];

export const BROKER_DIRECT_FIELDS = [
  "salutation", "first_name", "last_name", "position", "phone", "cell",
];

export const BROKER_CSV_FIELDS: string[] = [];

export const BROKER_JSON_FIELDS = ["partial_custom_fields"];
