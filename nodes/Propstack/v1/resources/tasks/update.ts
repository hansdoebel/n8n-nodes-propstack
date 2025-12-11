import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";
import { API_ENDPOINTS } from "../../constants";

function buildTasksUpdateBody(this: IExecuteFunctions): IDataObject {
  const options = this.getNodeParameter(
    "additionalFields",
    0,
    {},
  ) as IDataObject;
  const body: IDataObject = {};

  if (options.title) {
    body.title = options.title;
  }
  if (options.note_type_id) {
    body.note_type_id = options.note_type_id;
  }
  if (options.body) {
    body.body = options.body;
  }
  if (options.broker_id) {
    body.broker_id = options.broker_id;
  }
  if (options.task_creator_id) {
    body.task_creator_id = options.task_creator_id;
  }
  if (options.task_updater_id) {
    body.task_updater_id = options.task_updater_id;
  }

  if (options.is_reminder !== undefined) {
    body.is_reminder = options.is_reminder;
  }
  if (options.due_date) {
    body.due_date = options.due_date;
  }
  if (options.remind_at) {
    body.remind_at = options.remind_at;
  }
  if (options.done !== undefined) {
    body.done = options.done;
  }

  if (options.is_event !== undefined) {
    body.is_event = options.is_event;
  }
  if (options.starts_at) {
    body.starts_at = options.starts_at;
  }
  if (options.ends_at) {
    body.ends_at = options.ends_at;
  }
  if (options.location) {
    body.location = options.location;
  }
  if (options.all_day !== undefined) {
    body.all_day = options.all_day;
  }
  if (options.private !== undefined) {
    body.private = options.private;
  }
  if (options.recurring !== undefined) {
    body.recurring = options.recurring;
  }
  if (options.rrule) {
    body.rrule = options.rrule;
  }

  if (options.client_ids) {
    const clientIds = (options.client_ids as string).split(",").map((id) =>
      id.trim()
    );
    body.client_ids = clientIds;
  }
  if (options.property_ids) {
    const propertyIds = (options.property_ids as string).split(",").map((
      id,
    ) => id.trim());
    body.property_ids = propertyIds;
  }
  if (options.project_ids) {
    const projectIds = (options.project_ids as string).split(",").map((
      id,
    ) => id.trim());
    body.project_ids = projectIds;
  }

  return body;
}

export async function tasksUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const taskId = extractResourceLocatorValue(
    this.getNodeParameter("taskId", 0),
  );
  const body = buildTasksUpdateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.TASKS_UPDATE(taskId),
    body: { task: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
