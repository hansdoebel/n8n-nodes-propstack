import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";
import { API_ENDPOINTS } from "../../constants";

export async function tasksDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const taskId = extractResourceLocatorValue(
    this.getNodeParameter("taskId", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.TASKS_DELETE(taskId),
  });

  return this.helpers.returnJsonArray({ success: true, id: taskId });
}
