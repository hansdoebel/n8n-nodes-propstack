import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest, simplifyResponse, splitCsv } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "object_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "postal_code", "status", "created_at", "updated_at",
];

const showForPropertiesGetAll = {
  operation: ["getAll"],
  resource: ["properties"],
};

const skipZero =
  (key: string) =>
  (v: unknown): [string, unknown] | undefined =>
    v === 0 ? undefined : [key, v];

const GETALL_QS_MAPPING: Record<string, string | ((v: unknown) => [string, unknown] | undefined)> = {
  expand: "expand",
  include_translations: "include_translations",
  sort_by: "sort_by",
  order: "order",
  q: "q",
  status: "status",
  country: "country",
  marketing_type: "marketing_type",
  rs_type: "rs_type",
  project_id: "project_id",
  archived: "archived",
  property_ids: splitCsv("property_ids"),
  include_variants: "include_variants",
  exact: "exact",
  group: "group",
  price_from: skipZero("price_from"),
  price_to: skipZero("price_to"),
  base_rent_from: skipZero("base_rent_from"),
  base_rent_to: skipZero("base_rent_to"),
  total_rent_from: skipZero("total_rent_from"),
  total_rent_to: skipZero("total_rent_to"),
  property_space_value_from: skipZero("property_space_value_from"),
  property_space_value_to: skipZero("property_space_value_to"),
  living_space_from: skipZero("living_space_from"),
  living_space_to: skipZero("living_space_to"),
  plot_area_from: skipZero("plot_area_from"),
  plot_area_to: skipZero("plot_area_to"),
  number_of_rooms_from: skipZero("number_of_rooms_from"),
  number_of_rooms_to: skipZero("number_of_rooms_to"),
  number_of_bed_rooms_from: skipZero("number_of_bed_rooms_from"),
  number_of_bed_rooms_to: skipZero("number_of_bed_rooms_to"),
  number_of_bath_rooms_from: skipZero("number_of_bath_rooms_from"),
  number_of_bath_rooms_to: skipZero("number_of_bath_rooms_to"),
  floor_from: skipZero("floor_from"),
  floor_to: skipZero("floor_to"),
  construction_year_from: skipZero("construction_year_from"),
  construction_year_to: skipZero("construction_year_to"),
};

export const propertiesGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForPropertiesGetAll,
    },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    displayOptions: {
      show: {
        ...showForPropertiesGetAll,
        returnAll: [false],
      },
    },
    description: "Max number of results to return",
    typeOptions: {
      minValue: 1,
      maxValue: 500,
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForPropertiesGetAll,
    },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "options",
        default: "0",
        options: [
          { name: "Not Archived", value: "0" },
          { name: "Archived Only", value: "1" },
          { name: "All", value: "-1" },
        ],
        description: "Filter by archived status",
      },
      {
        displayName: "Base Rent From",
        name: "base_rent_from",
        type: "number",
        default: 0,
        description: "Minimum base rent",
      },
      {
        displayName: "Base Rent To",
        name: "base_rent_to",
        type: "number",
        default: 0,
        description: "Maximum base rent",
      },
      {
        displayName: "Construction Year From",
        name: "construction_year_from",
        type: "number",
        default: 0,
        description: "Minimum construction year",
      },
      {
        displayName: "Construction Year To",
        name: "construction_year_to",
        type: "number",
        default: 0,
        description: "Maximum construction year",
      },
      {
        displayName: "Country",
        name: "country",
        type: "string",
        default: "",
        description: "Filter by country code (2-letter ISO, e.g., DE)",
      },
      {
        displayName: "Exact Match",
        name: "exact",
        type: "boolean",
        default: false,
        description:
          "Whether to use case-sensitive exact matching for STRING/TEXT custom fields",
      },
      {
        displayName: "Expand",
        name: "expand",
        type: "boolean",
        default: false,
        description: "Whether to return detailed JSON with custom fields",
      },
      {
        displayName: "Group",
        name: "group",
        type: "string",
        default: "",
        description: "Filter by feature ID requirement",
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
        displayName: "Include Variants",
        name: "include_variants",
        type: "boolean",
        default: false,
        description: "Whether to include property variants",
      },
      {
        displayName: "Living Space From",
        name: "living_space_from",
        type: "number",
        default: 0,
        description: "Minimum living space in square meters",
      },
      {
        displayName: "Living Space To",
        name: "living_space_to",
        type: "number",
        default: 0,
        description: "Maximum living space in square meters",
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
        description: "Filter by marketing type",
      },
      {
        displayName: "Number of Rooms From",
        name: "number_of_rooms_from",
        type: "number",
        default: 0,
        description: "Minimum number of rooms",
      },
      {
        displayName: "Number of Rooms To",
        name: "number_of_rooms_to",
        type: "number",
        default: 0,
        description: "Maximum number of rooms",
      },
      {
        displayName: "Order",
        name: "order",
        type: "options",
        default: "desc",
        options: [
          { name: "Ascending", value: "asc" },
          { name: "Descending", value: "desc" },
        ],
        description: "Sort order",
      },
      {
        displayName: "Page",
        name: "page",
        type: "number",
        default: 1,
        description: "Page number for pagination",
        typeOptions: {
          minValue: 1,
        },
      },
      {
        displayName: "Plot Area From",
        name: "plot_area_from",
        type: "number",
        default: 0,
        description: "Minimum plot area in square meters",
      },
      {
        displayName: "Plot Area To",
        name: "plot_area_to",
        type: "number",
        default: 0,
        description: "Maximum plot area in square meters",
      },
      {
        displayName: "Price From",
        name: "price_from",
        type: "number",
        default: 0,
        description: "Minimum price",
      },
      {
        displayName: "Price To",
        name: "price_to",
        type: "number",
        default: 0,
        description: "Maximum price",
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
        description: "Filter by project ID",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Filter by specific Propstack IDs (comma-separated)",
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
        description: "Filter by real estate type",
      },
      {
        displayName: "Search Query",
        name: "q",
        type: "string",
        default: "",
        description:
          "Full-text search across unit_id, street, zip, city, district, exposee_id",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
        type: "options",
        default: "unit_id.raw",
        options: [
          { name: "Base Rent", value: "base_rent" },
          { name: "Construction Year", value: "construction_year" },
          { name: "Created At", value: "created_at" },
          { name: "Exposee ID", value: "exposee_id" },
          { name: "Floor", value: "floor" },
          { name: "Living Space", value: "living_space" },
          { name: "Number of Rooms", value: "number_of_rooms" },
          { name: "Plot Area", value: "plot_area" },
          { name: "Price", value: "price" },
          { name: "Price Per SQM", value: "price_per_sqm" },
          { name: "Property Space", value: "property_space_value" },
          { name: "Total Rent", value: "total_rent" },
          { name: "Unit ID", value: "unit_id.raw" },
          { name: "Updated At", value: "updated_at" },
        ],
        description: "Field to sort by",
      },
      {
        displayName: "Status",
        name: "status",
        type: "string",
        default: "",
        description: "Filter by status ID(s), comma-separated",
      },
      {
        displayName: "With Meta",
        name: "with_meta",
        type: "boolean",
        default: true,
        description: "Whether to include metadata in response",
      },
    ],
  },
];

function extractData(response: unknown): IDataObject[] {
  const body = response as IDataObject;
  if (Array.isArray(body.data)) return body.data as IDataObject[];
  if (Array.isArray(response)) return response as IDataObject[];
  return [body];
}

export async function propertiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;

  const optionsQs = buildQs(options, GETALL_QS_MAPPING);
  if (options?.with_meta !== false) optionsQs.with_meta = 1;

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.PROPERTIES_GET_ALL,
        qs: { ...optionsQs, page: currentPage, per: 100 },
      });

      const results = extractData(response);
      allResults = allResults.concat(results);
      hasMore = results.length >= 100;
      currentPage++;
    }

    return this.helpers.returnJsonArray(
      simplify ? simplifyResponse(allResults, PROPERTIES_SIMPLIFIED_FIELDS) : allResults,
    );
  }

  const page = (options?.page as number) || 1;

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROPERTIES_GET_ALL,
    qs: { ...optionsQs, page, per: limit },
  });

  const data = extractData(response);
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}
