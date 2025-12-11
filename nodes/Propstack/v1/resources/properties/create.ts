import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForPropertiesCreate = {
  operation: ["create"],
  resource: ["properties"],
};

export const propertiesCreateDescription: INodeProperties[] = [
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
        description: "External exposé identifier",
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
        displayName: "Marketing Type",
        name: "marketing_type",
        type: "options",
        default: "BUY",
        options: [
          { name: "Buy", value: "BUY" },
          { name: "Rent", value: "RENT" },
        ],
        description: "Marketing type for the property",
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
        displayName: "Object Type",
        name: "object_type",
        type: "options",
        default: "LIVING",
        options: [
          { name: "Living", value: "LIVING" },
          { name: "Commercial", value: "COMMERCIAL" },
          { name: "Investment", value: "INVESTMENT" },
        ],
        description: "Type of property object",
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
        displayName: "Real Estate Type",
        name: "rs_type",
        type: "options",
        default: "APARTMENT",
        options: [
          { name: "Apartment", value: "APARTMENT" },
          { name: "Garage", value: "GARAGE" },
          { name: "Gastronomy", value: "GASTRONOMY" },
          { name: "House", value: "HOUSE" },
          { name: "Industry", value: "INDUSTRY" },
          { name: "Investment", value: "INVESTMENT" },
          { name: "Office", value: "OFFICE" },
          {
            name: "Short Term Accommodation",
            value: "SHORT_TERM_ACCOMODATION",
          },
          { name: "Special Purpose", value: "SPECIAL_PURPOSE" },
          { name: "Store", value: "STORE" },
          { name: "Trade Site", value: "TRADE_SITE" },
        ],
        description: "Real estate type classification",
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

function buildPropertiesCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "unit_id",
      "exposee_id",
      "object_type",
      "rs_type",
      "rs_category",
      "marketing_type",
      "title",
      "description_note",
      "street",
      "street_number",
      "zip",
      "city",
      "country",
      "district",
      "price",
      "base_rent",
      "total_rent",
      "living_space",
      "property_space_value",
      "plot_area",
      "number_of_rooms",
      "number_of_bed_rooms",
      "number_of_bath_rooms",
      "floor",
      "construction_year",
      "status",
      "project_id",
      "location_note",
      "furnishing_note",
      "other_note",
      "courtage",
      "include_translations",
      "locale",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
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

    if (options.relationships_attributes) {
      try {
        body.relationships_attributes = JSON.parse(
          options.relationships_attributes as string,
        );
      } catch {
        body.relationships_attributes =
          options.relationships_attributes;
      }
    }
  }

  return body;
}

export async function propertiesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildPropertiesCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.PROPERTIES_CREATE,
    body: { property: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default propertiesCreateDescription;
