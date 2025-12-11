import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForTasksCreate = {
  operation: ["create"],
  resource: ["tasks"],
};

export const tasksCreateDescription: INodeProperties[] = [
  {
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForTasksCreate,
    },
    description: "Activity heading",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForTasksCreate,
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
        description: "HTML-formatted notes section",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
        description: "Assigned user ID",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Contact associations (comma-separated)",
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
        description: "Due date for reminder",
      },
      {
        displayName: "Ends At",
        name: "ends_at",
        type: "dateTime",
        default: "",
        description: "Event end date/time",
      },
      {
        displayName: "Is Event",
        name: "is_event",
        type: "boolean",
        default: false,
        description: "Whether this is an event/appointment",
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
        description: "Event location",
      },
      {
        displayName: "Note Type ID",
        name: "note_type_id",
        type: "string",
        default: "",
        description: "Activity type ID",
      },
      {
        displayName: "Private",
        name: "private",
        type: "boolean",
        default: false,
        description: "Whether this event is private",
      },
      {
        displayName: "Project IDs",
        name: "project_ids",
        type: "string",
        default: "",
        description: "Project associations (comma-separated)",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Property/unit associations (comma-separated)",
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
        description: "Reminder notification date/time",
      },
      {
        displayName: "RRule",
        name: "rrule",
        type: "string",
        default: "",
        description: "Recurrence rules (iCalendar format)",
      },
      {
        displayName: "Starts At",
        name: "starts_at",
        type: "dateTime",
        default: "",
        description: "Event start date/time",
      },
      {
        displayName: "Task Creator ID",
        name: "task_creator_id",
        type: "string",
        default: "",
        description: "Original creator ID",
      },
      {
        displayName: "Task Updater ID",
        name: "task_updater_id",
        type: "string",
        default: "",
        description: "Last modifier ID",
      },
    ],
  },
];

function buildTasksCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.title = this.getNodeParameter("title", 0) as string;

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "note_type_id",
      "body",
      "broker_id",
      "task_creator_id",
      "task_updater_id",
      "is_reminder",
      "due_date",
      "remind_at",
      "done",
      "is_event",
      "starts_at",
      "ends_at",
      "location",
      "all_day",
      "private",
      "recurring",
      "rrule",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }

    if (options.client_ids) {
      body.client_ids = (options.client_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
    if (options.property_ids) {
      body.property_ids = (options.property_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
    if (options.project_ids) {
      body.project_ids = (options.project_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
  }

  return body;
}

export async function tasksCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildTasksCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.TASKS_CREATE,
    body: { task: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default tasksCreateDescription;
