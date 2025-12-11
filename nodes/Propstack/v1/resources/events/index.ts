import { INodeProperties } from "n8n-workflow";

export const eventsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["events"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many events",
        description: "Retrieve a list of events",
      },
    ],
    default: "getAll",
  },
];

export const eventsFields: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["events"],
        operation: ["getAll"],
      },
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

export { eventsGetAll } from "./getAll";
