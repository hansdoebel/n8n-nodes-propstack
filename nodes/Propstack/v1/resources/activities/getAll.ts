import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForActivitiesGetAll = {
  operation: ["getAll"],
  resource: ["activities"],
};

export const activitiesGetAllDescription: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForActivitiesGetAll,
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
        ...showForActivitiesGetAll,
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
      show: showForActivitiesGetAll,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
        description: "Activity owner/assignee ID",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Contact identifiers (comma-separated)",
      },
      {
        displayName: "Creator ID",
        name: "creator_id",
        type: "string",
        default: "",
        description: "Creator identifier",
      },
      {
        displayName: "Expand",
        name: "expand",
        type: "boolean",
        default: false,
        description: "Whether to return detailed JSON with custom fields",
      },
      {
        displayName: "Item Type",
        name: "item_type",
        type: "options",
        default: "message",
        options: [
          { name: "Cancellation", value: "cancelation" },
          { name: "Decision", value: "decision" },
          { name: "Event", value: "event" },
          { name: "Letter", value: "letter" },
          { name: "Message", value: "message" },
          { name: "Note", value: "note" },
          { name: "Policy", value: "policy" },
          { name: "Reminder", value: "reminder" },
          { name: "SMS", value: "sms" },
        ],
        description: "Activity type filter",
      },
      {
        displayName: "Not Completed",
        name: "not_completed",
        type: "boolean",
        default: false,
        description: "Whether to fetch incomplete items only",
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
        displayName: "Project IDs",
        name: "project_ids",
        type: "string",
        default: "",
        description: "Project identifiers (comma-separated)",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Property identifiers (comma-separated)",
      },
      {
        displayName: "Reason IDs",
        name: "reason_ids",
        type: "string",
        default: "",
        description: "Cancellation reason identifiers (comma-separated)",
      },
      {
        displayName: "Starts At From",
        name: "starts_at_from",
        type: "dateTime",
        default: "",
        description: "Start date range from (ISO 8601 format)",
      },
      {
        displayName: "Starts At To",
        name: "starts_at_to",
        type: "dateTime",
        default: "",
        description: "Start date range to (ISO 8601 format)",
      },
    ],
  },
];

export async function activitiesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 20) as number;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

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
        if (options.broker_id) {
          qs.broker_id = options.broker_id;
        }
        if (options.creator_id) {
          qs.creator_id = options.creator_id;
        }
        if (options.expand) qs.expand = options.expand;
        if (options.item_type) {
          qs.item_type = options.item_type;
        }
        if (options.not_completed) {
          qs.not_completed = options.not_completed;
        }
        if (options.order) qs.order = options.order;

        if (options.client_ids) {
          qs.client_ids = (options.client_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.project_ids) {
          qs.project_ids = (options.project_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.property_ids) {
          qs.property_ids = (options.property_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.reason_ids) {
          qs.reason_ids = (options.reason_ids as string)
            .split(",")
            .map((id) => id.trim());
        }
        if (options.starts_at_from) {
          qs.starts_at_from = options.starts_at_from;
        }
        if (options.starts_at_to) {
          qs.starts_at_to = options.starts_at_to;
        }
      }

      const response = await propstackRequest.call(this, {
        method: "GET",
        url: API_ENDPOINTS.ACTIVITIES_GET_ALL,
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

    return this.helpers.returnJsonArray(allResults);
  }

  const qs: IDataObject = {
    page: 1,
    per: limit,
  };

  if (options) {
    if (options.broker_id) qs.broker_id = options.broker_id;
    if (options.creator_id) {
      qs.creator_id = options.creator_id;
    }
    if (options.expand) qs.expand = options.expand;
    if (options.item_type) qs.item_type = options.item_type;
    if (options.not_completed) {
      qs.not_completed = options.not_completed;
    }
    if (options.order) qs.order = options.order;

    if (options.client_ids) {
      qs.client_ids = (options.client_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.project_ids) {
      qs.project_ids = (options.project_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.property_ids) {
      qs.property_ids = (options.property_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.reason_ids) {
      qs.reason_ids = (options.reason_ids as string)
        .split(",")
        .map((id) => id.trim());
    }
    if (options.starts_at_from) {
      qs.starts_at_from = options.starts_at_from;
    }
    if (options.starts_at_to) {
      qs.starts_at_to = options.starts_at_to;
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.ACTIVITIES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default activitiesGetAllDescription;
