import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForEventsGetAll = {
  operation: ["getAll"],
  resource: ["events"],
};

export const eventsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForEventsGetAll,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker",
        type: "string",
        default: "",
        description: "Filter by assigned user ID",
      },
      {
        displayName: "Client ID",
        name: "client",
        type: "string",
        default: "",
        description: "Filter by contact ID",
      },
      {
        displayName: "Ends At After",
        name: "endsAtAfter",
        type: "dateTime",
        default: "",
        description: "Filter by end date range (after)",
      },
      {
        displayName: "Ends At Before",
        name: "endsAtBefore",
        type: "dateTime",
        default: "",
        description: "Filter by end date range (before)",
      },
      {
        displayName: "Note Type ID",
        name: "noteType",
        type: "string",
        default: "",
        description: "Filter by event category ID",
      },
      {
        displayName: "Project ID",
        name: "project",
        type: "string",
        default: "",
        description: "Filter by project ID",
      },
      {
        displayName: "Property ID",
        name: "property",
        type: "string",
        default: "",
        description: "Filter by property ID",
      },
      {
        displayName: "Recurring",
        name: "recurring",
        type: "boolean",
        default: false,
        description: "Whether to filter for recurring events only",
      },
      {
        displayName: "Starts At After",
        name: "startsAtAfter",
        type: "dateTime",
        default: "",
        description: "Filter by event start date range (after)",
      },
      {
        displayName: "Starts At Before",
        name: "startsAtBefore",
        type: "dateTime",
        default: "",
        description: "Filter by event start date range (before)",
      },
      {
        displayName: "State",
        name: "state",
        type: "options",
        default: "cancelled",
        options: [
          { name: "Cancelled", value: "cancelled" },
          { name: "Neutral", value: "neutral" },
          { name: "Took Place", value: "took_place" },
        ],
        description: "Filter by event phase",
      },
      {
        displayName: "Tag ID",
        name: "tag",
        type: "string",
        default: "",
        description: "Filter by characteristic/group ID",
      },
    ],
  },
];

export async function eventsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {};

  if (options) {
    if (options.broker) {
      qs.broker = parseInt(options.broker as string, 10);
    }
    if (options.client) {
      qs.client = parseInt(options.client as string, 10);
    }
    if (options.endsAtAfter) {
      qs.ends_at_after = options.endsAtAfter;
    }
    if (options.endsAtBefore) {
      qs.ends_at_before = options.endsAtBefore;
    }
    if (options.noteType) {
      qs.note_type = parseInt(options.noteType as string, 10);
    }
    if (options.property) {
      qs.property = parseInt(options.property as string, 10);
    }
    if (options.project) {
      qs.project = parseInt(options.project as string, 10);
    }
    if (options.recurring !== undefined) {
      qs.recurring = options.recurring;
    }
    if (options.startsAtAfter) {
      qs.starts_at_after = options.startsAtAfter;
    }
    if (options.startsAtBefore) {
      qs.starts_at_before = options.startsAtBefore;
    }
    if (options.state) qs.state = options.state;
    if (options.tag) {
      qs.tag = parseInt(options.tag as string, 10);
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.EVENTS_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default eventsGetAllDescription;
