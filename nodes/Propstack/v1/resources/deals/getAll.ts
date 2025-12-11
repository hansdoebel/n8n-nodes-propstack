import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest, simplifyResponse } from "../../helpers";

const DEALS_SIMPLIFIED_FIELDS = [
  "id", "client_id", "property_id", "deal_stage_id",
  "price", "status", "created_at", "updated_at",
];

const showForDealsGetAll = {
  operation: ["getAll"],
  resource: ["deals"],
};

export const dealsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForDealsGetAll,
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
        ...showForDealsGetAll,
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
      show: showForDealsGetAll,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
        description: "Filter by broker/deal owner",
      },
      {
        displayName: "Category",
        name: "category",
        type: "options",
        default: "qualified",
        options: [
          { name: "Qualified", value: "qualified" },
          { name: "Unqualified", value: "unqualified" },
          { name: "Lost", value: "lost" },
        ],
        description: "Deal classification filter",
      },
      {
        displayName: "Client ID",
        name: "client_id",
        type: "string",
        default: "",
        description: "Filter by client/contact",
      },
      {
        displayName: "Created At From",
        name: "created_at_from",
        type: "dateTime",
        default: "",
        description: "Filter deals created from this date",
      },
      {
        displayName: "Created At To",
        name: "created_at_to",
        type: "dateTime",
        default: "",
        description: "Filter deals created until this date",
      },
      {
        displayName: "Deal Pipeline ID",
        name: "deal_pipeline_id",
        type: "string",
        default: "",
        description: "Pipeline identifier to filter by",
      },
      {
        displayName: "Deal Stage IDs",
        name: "deal_stage_ids",
        type: "string",
        default: "",
        description: "Pipeline stage IDs to filter by (comma-separated)",
      },
      {
        displayName: "Feeling From",
        name: "feeling_from",
        type: "number",
        default: 0,
        description: "Minimum confidence rating",
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
      },
      {
        displayName: "Feeling To",
        name: "feeling_to",
        type: "number",
        default: 0,
        description: "Maximum confidence rating",
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
      },
      {
        displayName: "Hide Archived Properties",
        name: "hide_archived_properties",
        type: "boolean",
        default: false,
        description: "Whether to hide deals with archived properties",
      },
      {
        displayName: "Include",
        name: "include",
        type: "multiOptions",
        default: [],
        options: [
          { name: "Client", value: "client" },
          { name: "Property", value: "property" },
        ],
        description: "Associated entities to include in response",
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
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
        description: "Filter by property",
      },
      {
        displayName: "Show Archived Clients",
        name: "show_archived_clients",
        type: "boolean",
        default: false,
        description: "Whether to include deals with archived clients",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
        type: "string",
        default: "",
        description: "Field to sort by",
      },
      {
        displayName: "Start Date From",
        name: "start_date_from",
        type: "dateTime",
        default: "",
        description: "Filter deals with start date from",
      },
      {
        displayName: "Start Date To",
        name: "start_date_to",
        type: "dateTime",
        default: "",
        description: "Filter deals with start date until",
      },
    ],
  },
];

export async function dealsGetAll(
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
        if (options.include) {
          qs.include = (options.include as string[]).join(",");
        }
        if (options.sort_by) qs.sort_by = options.sort_by;
        if (options.order) qs.order = options.order;
        if (
          options.category !== undefined &&
          options.category !== ""
        ) {
          qs.category = options.category;
        }
        if (options.deal_stage_ids) {
          qs.deal_stage_ids = (options.deal_stage_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.deal_pipeline_id) {
          qs.deal_pipeline_id = options.deal_pipeline_id;
        }
        if (options.broker_id) {
          qs.broker_id = options.broker_id;
        }
        if (options.client_id) {
          qs.client_id = options.client_id;
        }
        if (options.property_id) {
          qs.property_id = options.property_id;
        }
        if (
          options.feeling_from !== undefined &&
          options.feeling_from !== 0 &&
          options.feeling_from !== ""
        ) {
          qs.feeling_from = options.feeling_from;
        }
        if (
          options.feeling_to !== undefined &&
          options.feeling_to !== 0 &&
          options.feeling_to !== ""
        ) {
          qs.feeling_to = options.feeling_to;
        }
        if (options.created_at_from) {
          qs.created_at_from = options.created_at_from;
        }
        if (options.created_at_to) {
          qs.created_at_to = options.created_at_to;
        }
        if (options.start_date_from) {
          qs.start_date_from = options.start_date_from;
        }
        if (options.start_date_to) {
          qs.start_date_to = options.start_date_to;
        }
        if (options.show_archived_clients) {
          qs.show_archived_clients = options.show_archived_clients;
        }
        if (options.hide_archived_properties) {
          qs.hide_archived_properties =
            options.hide_archived_properties;
        }
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.DEALS_GET_ALL,
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
      simplify ? simplifyResponse(allResults, DEALS_SIMPLIFIED_FIELDS) : allResults,
    );
  }

  const qs: IDataObject = {
    page,
    per_page: limit,
  };

  if (options) {
    if (options.include) {
      qs.include = (options.include as string[]).join(",");
    }
    if (options.sort_by) qs.sort_by = options.sort_by;
    if (options.order) qs.order = options.order;
    if (
      options.category !== undefined &&
      options.category !== ""
    ) {
      qs.category = options.category;
    }
    if (options.deal_stage_ids) {
      qs.deal_stage_ids = (options.deal_stage_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.deal_pipeline_id) {
      qs.deal_pipeline_id = options.deal_pipeline_id;
    }
    if (options.broker_id) qs.broker_id = options.broker_id;
    if (options.client_id) qs.client_id = options.client_id;
    if (options.property_id) {
      qs.property_id = options.property_id;
    }
    if (
      options.feeling_from !== undefined &&
      options.feeling_from !== 0 &&
      options.feeling_from !== ""
    ) {
      qs.feeling_from = options.feeling_from;
    }
    if (
      options.feeling_to !== undefined &&
      options.feeling_to !== 0 &&
      options.feeling_to !== ""
    ) {
      qs.feeling_to = options.feeling_to;
    }
    if (options.created_at_from) {
      qs.created_at_from = options.created_at_from;
    }
    if (options.created_at_to) {
      qs.created_at_to = options.created_at_to;
    }
    if (options.start_date_from) {
      qs.start_date_from = options.start_date_from;
    }
    if (options.start_date_to) {
      qs.start_date_to = options.start_date_to;
    }
    if (options.show_archived_clients) {
      qs.show_archived_clients = options.show_archived_clients;
    }
    if (options.hide_archived_properties) {
      qs.hide_archived_properties = options.hide_archived_properties;
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DEALS_GET_ALL,
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, DEALS_SIMPLIFIED_FIELDS) : data,
  );
}

export default dealsGetAllDescription;
