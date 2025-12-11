import { INodeProperties } from "n8n-workflow";

export const activitiesOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["activities"],
      },
    },
    options: [
      {
        name: "Get",
        value: "get",
        action: "Get activity",
        description: "Retrieve an activity",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many activities",
        description: "Retrieve a list of activities",
      },
      {
        name: "Get Activity Types",
        value: "getActivityTypes",
        action: "Get activity types",
        description: "Retrieve available activity types",
      },
      {
        name: "Get Reservation Reasons",
        value: "getReservationReasons",
        action: "Get reservation reasons",
        description: "Retrieve available reservation reasons",
      },
    ],
    default: "getAll",
  },
];

export const activitiesFields: INodeProperties[] = [
  {
    displayName: "Activity",
    name: "activityId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "The activity to retrieve",
    displayOptions: {
      show: {
        resource: ["activities"],
        operation: ["get"],
      },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchActivities",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 12345",
      },
    ],
  },
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    description: "Whether to return all results or only up to a given limit",
    displayOptions: {
      show: {
        resource: ["activities"],
        operation: ["getAll"],
      },
    },
    default: false,
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    description: "Max number of results to return",
    displayOptions: {
      show: {
        resource: ["activities"],
        operation: ["getAll"],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["activities"],
        operation: ["getAll"],
      },
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
        description: "Comma-separated list of contact IDs",
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
        description: "Comma-separated list of project IDs",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of property IDs",
      },
      {
        displayName: "Reason IDs",
        name: "reason_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of cancellation reason IDs",
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

export { activitiesGet } from "./get";
export { activitiesGetAll } from "./getAll";
export { activityTypesGetAll } from "./activityTypesGetAll";
export { reservationReasonsGetAll } from "./reservationReasonsGetAll";
