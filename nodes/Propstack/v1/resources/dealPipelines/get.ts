import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const dealPipelinesGetDescription: INodeProperties[] = [];

export async function dealPipelinesGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const pipelineId = extractResourceLocatorValue(
    this.getNodeParameter("pipelineId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DEAL_PIPELINES_GET(pipelineId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default dealPipelinesGetDescription;
