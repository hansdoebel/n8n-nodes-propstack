import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest, simplifyResponse } from "../../helpers";

const CONTACTS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "email", "phone_number",
  "company", "status", "created_at", "updated_at",
];

const showForContactsGetAll = {
  operation: ["getAll"],
  resource: ["contacts"],
};

export const contactsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForContactsGetAll,
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
        ...showForContactsGetAll,
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
      show: showForContactsGetAll,
    },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "options",
        default: 0,
        options: [
          { name: "Not Archived", value: 0 },
          { name: "Archived Only", value: 1 },
          { name: "All", value: -1 },
        ],
        description: "Filter by archived status",
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "e.g. nathan@example.com",
        default: "",
        description: "Filter by exact email address",
      },
      {
        displayName: "Expand",
        name: "expand",
        type: "boolean",
        default: false,
        description: "Whether to return detailed JSON with custom fields",
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
        description: "Filter by GDPR consent status",
      },
      {
        displayName: "Group IDs",
        name: "group",
        type: "string",
        default: "",
        description: "Filter by group IDs (comma-separated)",
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
        displayName: "Phone Number",
        name: "phone_number",
        type: "string",
        default: "",
        description: "Filter by exact phone number",
      },
      {
        displayName: "Search Query",
        name: "q",
        type: "string",
        default: "",
        description:
          "Full-text search across names, emails, addresses, phone numbers",
      },
      {
        displayName: "Sort By",
        name: "sort_by",
        type: "options",
        default: "created_at",
        options: [
          { name: "Created At", value: "created_at" },
          { name: "First Name", value: "first_name" },
          { name: "Last Contact At", value: "last_contact_at" },
          { name: "Last Name", value: "last_name" },
          { name: "Updated At", value: "updated_at" },
        ],
        description: "Field to sort by",
      },
      {
        displayName: "Sources",
        name: "sources",
        type: "string",
        default: "",
        description: "Filter by source values (comma-separated)",
      },
      {
        displayName: "Status",
        name: "status",
        type: "string",
        default: "",
        description: "Filter by status values (comma-separated)",
      },
    ],
  },
];

export async function contactsGetAll(
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
        per: 100,
      };

      if (options) {
        if (options.expand) qs.expand = options.expand;
        if (options.sort_by) qs.sort_by = options.sort_by;
        if (options.order) qs.order = options.order;
        if (options.q) qs.q = options.q;
        if (options.email) qs.email = options.email;
        if (options.phone_number) {
          qs.phone_number = options.phone_number;
        }
        if (
          options.archived !== undefined &&
          options.archived !== ""
        ) {
          qs.archived = options.archived;
        }
        if (
          options.gdpr_status !== undefined &&
          options.gdpr_status !== ""
        ) {
          qs.gdpr_status = options.gdpr_status;
        }
        if (options.group) {
          qs.group = (options.group as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.status) {
          qs.status = (options.status as string)
            .split(",")
            .map((s) => s.trim());
        }
        if (options.sources) {
          qs.sources = (options.sources as string)
            .split(",")
            .map((s) => s.trim());
        }
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.CONTACTS_GET_ALL,
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
      simplify ? simplifyResponse(allResults, CONTACTS_SIMPLIFIED_FIELDS) : allResults,
    );
  }

  const qs: IDataObject = {
    page,
    per: limit,
  };

  if (options) {
    if (options.expand) qs.expand = options.expand;
    if (options.sort_by) qs.sort_by = options.sort_by;
    if (options.order) qs.order = options.order;
    if (options.q) qs.q = options.q;
    if (options.email) qs.email = options.email;
    if (options.phone_number) {
      qs.phone_number = options.phone_number;
    }
    if (
      options.archived !== undefined &&
      options.archived !== ""
    ) {
      qs.archived = options.archived;
    }
    if (
      options.gdpr_status !== undefined &&
      options.gdpr_status !== ""
    ) {
      qs.gdpr_status = options.gdpr_status;
    }
    if (options.group) {
      qs.group = (options.group as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.status) {
      qs.status = (options.status as string)
        .split(",")
        .map((s) => s.trim());
    }
    if (options.sources) {
      qs.sources = (options.sources as string)
        .split(",")
        .map((s) => s.trim());
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.CONTACTS_GET_ALL,
    qs,
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data, CONTACTS_SIMPLIFIED_FIELDS) : data,
  );
}

export default contactsGetAllDescription;
