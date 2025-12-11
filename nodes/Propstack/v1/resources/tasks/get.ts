import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";
import { API_ENDPOINTS } from "../../constants";

export async function tasksGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const taskId = extractResourceLocatorValue(
    this.getNodeParameter("taskId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TASKS_GET(taskId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
