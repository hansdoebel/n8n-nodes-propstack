import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "object_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "postal_code", "status", "created_at", "updated_at",
];

const showForPropertiesGetAll = {
  operation: ["getAll"],
  resource: ["properties"],
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
      maxValue: 100,
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

export async function propertiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const page = (options?.page as number) || 1;

  if (returnAll) {
    let allResults: IDataObject[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const qs: IDataObject = {
        page: currentPage,
        per_page: 100,
      };

      if (options) {
        if (options.with_meta !== false) qs.with_meta = 1;
        if (options.expand) qs.expand = options.expand;
        if (options.include_translations) {
          qs.include_translations = options.include_translations;
        }
        if (options.sort_by) qs.sort_by = options.sort_by;
        if (options.order) qs.order = options.order;
        if (options.q) qs.q = options.q;
        if (options.status) qs.status = options.status;
        if (options.country) qs.country = options.country;
        if (options.marketing_type) {
          qs.marketing_type = options.marketing_type;
        }
        if (options.rs_type) qs.rs_type = options.rs_type;
        if (options.project_id) {
          qs.project_id = options.project_id;
        }
        if (
          options.archived !== undefined &&
          options.archived !== ""
        ) {
          qs.archived = options.archived;
        }
        if (options.property_ids) {
          qs.property_ids = (options.property_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.include_variants) {
          qs.include_variants = options.include_variants;
        }
        if (options.exact) qs.exact = options.exact;
        if (options.group) qs.group = options.group;

        const rangeFields = [
          "price",
          "base_rent",
          "total_rent",
          "property_space_value",
          "living_space",
          "plot_area",
          "number_of_rooms",
          "number_of_bed_rooms",
          "number_of_bath_rooms",
          "floor",
          "construction_year",
        ];

        for (const field of rangeFields) {
          const fromKey = `${field}_from`;
          const toKey = `${field}_to`;
          if (
            options[fromKey] !== undefined &&
            options[fromKey] !== 0 &&
            options[fromKey] !== ""
          ) {
            qs[fromKey] = options[fromKey];
          }
          if (
            options[toKey] !== undefined &&
            options[toKey] !== 0 &&
            options[toKey] !== ""
          ) {
            qs[toKey] = options[toKey];
          }
        }
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.PROPERTIES_GET_ALL,
        qs,
      });

      const results = Array.isArray(response) ? response : [response];
      allResults = allResults.concat(results);

      if (results.length < 100) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }

    const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
    return this.helpers.returnJsonArray(
      simplify ? simplifyResponse(allResults, PROPERTIES_SIMPLIFIED_FIELDS) : allResults,
    );
  }

  const qs: IDataObject = {
    page,
    per_page: limit,
  };

  if (options) {
    if (options.with_meta !== false) qs.with_meta = 1;
    if (options.expand) qs.expand = options.expand;
    if (options.include_translations) {
      qs.include_translations = options.include_translations;
    }
    if (options.sort_by) qs.sort_by = options.sort_by;
    if (options.order) qs.order = options.order;
    if (options.q) qs.q = options.q;
    if (options.status) qs.status = options.status;
    if (options.country) qs.country = options.country;
    if (options.marketing_type) {
      qs.marketing_type = options.marketing_type;
    }
    if (options.rs_type) qs.rs_type = options.rs_type;
    if (options.project_id) {
      qs.project_id = options.project_id;
    }
    if (
      options.archived !== undefined &&
      options.archived !== ""
    ) {
      qs.archived = options.archived;
    }
    if (options.property_ids) {
      qs.property_ids = (options.property_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.include_variants) {
      qs.include_variants = options.include_variants;
    }
    if (options.exact) qs.exact = options.exact;
    if (options.group) qs.group = options.group;

    const rangeFields = [
      "price",
      "base_rent",
      "total_rent",
      "property_space_value",
      "living_space",
      "plot_area",
      "number_of_rooms",
      "number_of_bed_rooms",
      "number_of_bath_rooms",
      "floor",
      "construction_year",
    ];

    for (const field of rangeFields) {
      const fromKey = `${field}_from`;
      const toKey = `${field}_to`;
      if (
        options[fromKey] !== undefined &&
        options[fromKey] !== 0 &&
        options[fromKey] !== ""
      ) {
        qs[fromKey] = options[fromKey];
      }
      if (
        options[toKey] !== undefined &&
        options[toKey] !== 0 &&
        options[toKey] !== ""
      ) {
        qs[toKey] = options[toKey];
      }
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROPERTIES_GET_ALL,
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}

export default propertiesGetAllDescription;
