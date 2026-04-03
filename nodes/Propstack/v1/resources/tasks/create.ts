import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest, splitCsvInt, toInt } from "../../helpers";

const TASK_BODY_MAPPING: Record<string, string | ((v: unknown) => [string, unknown])> = {
  note_type_id: toInt("note_type_id"),
  body: "body",
  broker_id: toInt("broker_id"),
  task_creator_id: toInt("task_creator_id"),
  task_updater_id: toInt("task_updater_id"),
  is_reminder: "is_reminder",
  due_date: "due_date",
  remind_at: "remind_at",
  done: "done",
  is_event: "is_event",
  starts_at: "starts_at",
  ends_at: "ends_at",
  location: "location",
  all_day: "all_day",
  private: "private",
  recurring: "recurring",
  rrule: "rrule",
  client_ids: splitCsvInt("client_ids"),
  property_ids: splitCsvInt("property_ids"),
  project_ids: splitCsvInt("project_ids"),
};

export async function tasksCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const title = this.getNodeParameter("title", 0) as string;
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body = buildQs(options, TASK_BODY_MAPPING);
  body.title = title;

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.TASKS_CREATE,
    body: { task: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
