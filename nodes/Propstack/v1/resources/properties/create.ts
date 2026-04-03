import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, parseJson, propstackRequest } from "../../helpers";

const showForPropertiesCreate = {
  operation: ["create"],
  resource: ["properties"],
};

const PROPERTY_BODY_MAPPING: Record<string, string | ((v: unknown) => [string, unknown])> = {
  unit_id: "unit_id",
  exposee_id: "exposee_id",
  object_type: "object_type",
  rs_type: "rs_type",
  rs_category: "rs_category",
  marketing_type: "marketing_type",
  title: "title",
  description_note: "description_note",
  street: "street",
  street_number: "street_number",
  zip: "zip",
  city: "city",
  country: "country",
  district: "district",
  price: "price",
  base_rent: "base_rent",
  total_rent: "total_rent",
  living_space: "living_space",
  property_space_value: "property_space_value",
  plot_area: "plot_area",
  number_of_rooms: "number_of_rooms",
  number_of_bed_rooms: "number_of_bed_rooms",
  number_of_bath_rooms: "number_of_bath_rooms",
  floor: "floor",
  construction_year: "construction_year",
  status: "status",
  project_id: "project_id",
  location_note: "location_note",
  furnishing_note: "furnishing_note",
  other_note: "other_note",
  courtage: "courtage",
  include_translations: "include_translations",
  locale: "locale",
  partial_custom_fields: parseJson("partial_custom_fields"),
  relationships_attributes: parseJson("relationships_attributes"),
};

export const propertiesCreateDescription: INodeProperties[] = [
  {
    displayName: "Object Type",
    name: "object_type",
    type: "options",
    required: true,
    default: "LIVING",
    displayOptions: {
      show: showForPropertiesCreate,
    },
    options: [
      { name: "Living", value: "LIVING" },
      { name: "Commercial", value: "COMMERCIAL" },
      { name: "Investment", value: "INVESTMENT" },
    ],
    description: "Property category (Oberkategorie)",
  },
  {
    displayName: "Real Estate Type",
    name: "rs_type",
    type: "options",
    required: true,
    default: "APARTMENT",
    displayOptions: {
      show: showForPropertiesCreate,
    },
    options: [
      { name: "Apartment", value: "APARTMENT" },
      { name: "Garage", value: "GARAGE" },
      { name: "Gastronomy", value: "GASTRONOMY" },
      { name: "House", value: "HOUSE" },
      { name: "Industry", value: "INDUSTRY" },
      { name: "Investment", value: "INVESTMENT" },
      { name: "Office", value: "OFFICE" },
      { name: "Short Term Accommodation", value: "SHORT_TERM_ACCOMODATION" },
      { name: "Special Purpose", value: "SPECIAL_PURPOSE" },
      { name: "Store", value: "STORE" },
      { name: "Trade Site", value: "TRADE_SITE" },
    ],
    description: "Real estate type classification (Kategorie)",
  },
  {
    displayName: "Marketing Type",
    name: "marketing_type",
    type: "options",
    required: true,
    default: "BUY",
    displayOptions: {
      show: showForPropertiesCreate,
    },
    options: [
      { name: "Buy", value: "BUY" },
      { name: "Rent", value: "RENT" },
    ],
    description: "Whether property is for sale or rent (Kauf/Miete)",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForPropertiesCreate,
    },
    options: [
      {
        displayName: "Base Rent",
        name: "base_rent",
        type: "number",
        default: 0,
        description: "Base rent amount",
      },
      {
        displayName: "City",
        name: "city",
        type: "string",
        default: "",
      },
      {
        displayName: "Construction Year",
        name: "construction_year",
        type: "number",
        default: 0,
        description: "Year of construction",
      },
      {
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
        description: "Country code (ISO 3166-1 alpha-2)",
      },
      {
        displayName: "Courtage",
        name: "courtage",
        type: "string",
        default: "",
        description: "Commission information",
      },
      {
        displayName: "Custom Fields",
        name: "partial_custom_fields",
        type: "string",
        default: "",
        description: "Custom fields as JSON object",
      },
      {
        displayName: "Description",
        name: "description_note",
        type: "string",
        default: "",
        description: "Property description",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "District",
        name: "district",
        type: "string",
        default: "",
        description: "District or neighborhood",
      },
      {
        displayName: "Exposee ID",
        name: "exposee_id",
        type: "string",
        default: "",
        description: "External expose identifier",
      },
      {
        displayName: "Floor",
        name: "floor",
        type: "number",
        default: 0,
        description: "Floor number",
      },
      {
        displayName: "Furnishing Note",
        name: "furnishing_note",
        type: "string",
        default: "",
        description: "Notes about furnishing",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Include Translations",
        name: "include_translations",
        type: "string",
        default: "",
        description:
          'Language codes for translations (comma-separated, e.g., "en,de")',
      },
      {
        displayName: "Living Space",
        name: "living_space",
        type: "number",
        default: 0,
        description: "Living space in square meters",
      },
      {
        displayName: "Locale",
        name: "locale",
        type: "string",
        default: "de",
        description: "Locale for the property data (default: de)",
      },
      {
        displayName: "Number of Bathrooms",
        name: "number_of_bath_rooms",
        type: "number",
        default: 0,
      },
      {
        displayName: "Number of Bedrooms",
        name: "number_of_bed_rooms",
        type: "number",
        default: 0,
      },
      {
        displayName: "Number of Rooms",
        name: "number_of_rooms",
        type: "number",
        default: 0,
        description: "Total number of rooms",
      },
      {
        displayName: "Other Note",
        name: "other_note",
        type: "string",
        default: "",
        description: "Other notes",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Plot Area",
        name: "plot_area",
        type: "number",
        default: 0,
        description: "Plot area in square meters",
      },
      {
        displayName: "Postal Code",
        name: "zip",
        type: "string",
        default: "",
      },
      {
        displayName: "Price",
        name: "price",
        type: "number",
        default: 0,
        description: "Sale price",
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
        description: "Associated project ID",
      },
      {
        displayName: "Property Space",
        name: "property_space_value",
        type: "number",
        default: 0,
        description: "Total property space in square meters",
      },
      {
        displayName: "Real Estate Category",
        name: "rs_category",
        type: "string",
        default: "",
        description: "Real estate category (e.g., PENTHOUSE, LOFT, VILLA)",
      },
      {
        displayName: "Relationships",
        name: "relationships_attributes",
        type: "string",
        default: "",
        description: "Relationships (owners/partners) as JSON array",
      },
      {
        displayName: "Street",
        name: "street",
        type: "string",
        default: "",
        description: "Street address",
      },
      {
        displayName: "Street Number",
        name: "street_number",
        type: "string",
        default: "",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "Property title",
      },
      {
        displayName: "Total Rent",
        name: "total_rent",
        type: "number",
        default: 0,
        description: "Total rent amount including additional costs",
      },
      {
        displayName: "Unit ID",
        name: "unit_id",
        type: "string",
        default: "",
        description: "Unique identifier for the property",
      },
    ],
  },
];

export async function propertiesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body = buildQs(options, PROPERTY_BODY_MAPPING);

  body.object_type = this.getNodeParameter("object_type", 0) as string;
  body.rs_type = this.getNodeParameter("rs_type", 0) as string;
  body.marketing_type = this.getNodeParameter("marketing_type", 0) as string;

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.PROPERTIES_CREATE,
    body: { property: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
