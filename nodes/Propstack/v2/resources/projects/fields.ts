import type { INodeProperties } from "n8n-workflow";

export const projectFieldOptions: INodeProperties[] = [
  {
    displayName: "Broker ID",
    name: "broker_id",
    type: "string",
    default: "",
  },
  {
    displayName: "City",
    name: "city",
    type: "string",
    default: "",
  },
  {
    displayName: "Country",
    name: "country",
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
    displayName: "Description Note",
    name: "description_note",
    type: "string",
    default: "",
    typeOptions: { rows: 4 },
  },
  {
    displayName: "Furnishing Note",
    name: "furnishing_note",
    type: "string",
    default: "",
    typeOptions: { rows: 4 },
  },
  {
    displayName: "Hide Address",
    name: "hide_address",
    type: "boolean",
    default: false,
    description: "Whether to hide the address",
  },
  {
    displayName: "House Number",
    name: "house_number",
    type: "string",
    default: "",
  },
  {
    displayName: "Latitude",
    name: "lat",
    type: "number",
    default: 0,
  },
  {
    displayName: "Location Note",
    name: "location_note",
    type: "string",
    default: "",
    typeOptions: { rows: 4 },
  },
  {
    displayName: "Longitude",
    name: "lng",
    type: "number",
    default: 0,
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    default: "",
  },
  {
    displayName: "Region",
    name: "region",
    type: "string",
    default: "",
  },
  {
    displayName: "Status",
    name: "status",
    type: "string",
    default: "",
  },
  {
    displayName: "Street",
    name: "street",
    type: "string",
    default: "",
  },
  {
    displayName: "Zip Code",
    name: "zip_code",
    type: "string",
    default: "",
  },
];

export const PROJECT_DIRECT_FIELDS = [
  "name", "broker_id", "status", "street", "house_number", "zip_code",
  "city", "country", "hide_address", "region", "description_note",
  "location_note", "furnishing_note", "lat", "lng",
];

export const PROJECT_CSV_FIELDS: string[] = [];

export const PROJECT_JSON_FIELDS = ["partial_custom_fields"];
