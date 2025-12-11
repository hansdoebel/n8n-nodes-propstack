import { INodeProperties } from "n8n-workflow";

export const tasksOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["tasks"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create task",
        description: "Create a new task",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete task",
        description: "Permanently remove a task",
      },
      {
        name: "Get",
        value: "get",
        action: "Get task",
        description: "Retrieve a task",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many tasks",
        description: "Retrieve a list of tasks",
      },
      {
        name: "Update",
        value: "update",
        action: "Update task",
        description: "Update an existing task",
      },
    ],
    default: "create",
  },
];

export const tasksFields: INodeProperties[] = [
  {
    displayName: "Task",
    name: "taskId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "The task to operate on",
    displayOptions: {
      show: {
        resource: ["tasks"],
        operation: ["get", "update", "delete"],
      },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchTasks",
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
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["tasks"],
        operation: ["create"],
      },
    },
    default: "",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["tasks"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "All Day",
        name: "all_day",
        type: "boolean",
        default: false,
        description: "Whether this is an all-day event",
      },
      {
        displayName: "Body",
        name: "body",
        type: "string",
        default: "",
      },
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of client IDs",
      },
      {
        displayName: "Done",
        name: "done",
        type: "boolean",
        default: false,
        description: "Whether the task is completed",
      },
      {
        displayName: "Due Date",
        name: "due_date",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Ends At",
        name: "ends_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Is Event",
        name: "is_event",
        type: "boolean",
        default: false,
        description: "Whether this is an event",
      },
      {
        displayName: "Is Reminder",
        name: "is_reminder",
        type: "boolean",
        default: false,
        description: "Whether this is a reminder task",
      },
      {
        displayName: "Location",
        name: "location",
        type: "string",
        default: "",
      },
      {
        displayName: "Note Type ID",
        name: "note_type_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Private",
        name: "private",
        type: "boolean",
        default: false,
        description: "Whether this task is private",
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
        displayName: "Recurring",
        name: "recurring",
        type: "boolean",
        default: false,
        description: "Whether this event recurs",
      },
      {
        displayName: "Remind At",
        name: "remind_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "RRule",
        name: "rrule",
        type: "string",
        default: "",
      },
      {
        displayName: "Starts At",
        name: "starts_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Task Creator ID",
        name: "task_creator_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Task Updater ID",
        name: "task_updater_id",
        type: "string",
        default: "",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["tasks"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "All Day",
        name: "all_day",
        type: "boolean",
        default: false,
        description: "Whether this is an all-day event",
      },
      {
        displayName: "Body",
        name: "body",
        type: "string",
        default: "",
      },
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of client IDs",
      },
      {
        displayName: "Done",
        name: "done",
        type: "boolean",
        default: false,
        description: "Whether the task is completed",
      },
      {
        displayName: "Due Date",
        name: "due_date",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Ends At",
        name: "ends_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Is Event",
        name: "is_event",
        type: "boolean",
        default: false,
        description: "Whether this is an event",
      },
      {
        displayName: "Is Reminder",
        name: "is_reminder",
        type: "boolean",
        default: false,
        description: "Whether this is a reminder task",
      },
      {
        displayName: "Location",
        name: "location",
        type: "string",
        default: "",
      },
      {
        displayName: "Note Type ID",
        name: "note_type_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Private",
        name: "private",
        type: "boolean",
        default: false,
        description: "Whether this task is private",
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
        displayName: "Recurring",
        name: "recurring",
        type: "boolean",
        default: false,
        description: "Whether this event recurs",
      },
      {
        displayName: "Remind At",
        name: "remind_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "RRule",
        name: "rrule",
        type: "string",
        default: "",
      },
      {
        displayName: "Starts At",
        name: "starts_at",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Task Creator ID",
        name: "task_creator_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Task Updater ID",
        name: "task_updater_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
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
        resource: ["tasks"],
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
        resource: ["tasks"],
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
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: {
      show: {
        resource: ["tasks"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Client ID",
        name: "client_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Done",
        name: "done",
        type: "boolean",
        default: false,
        description: "Whether to filter for completed tasks",
      },
      {
        displayName: "Is Event",
        name: "is_event",
        type: "boolean",
        default: false,
        description: "Whether to filter for events only",
      },
      {
        displayName: "Is Reminder",
        name: "is_reminder",
        type: "boolean",
        default: false,
        description: "Whether to filter for reminder tasks only",
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
      },
    ],
  },
];

export { tasksCreate } from "./create";
export { tasksDelete } from "./delete";
export { tasksGet } from "./get";
export { tasksGetAll } from "./getAll";
export { tasksUpdate } from "./update";
