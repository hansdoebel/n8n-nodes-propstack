import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForActivitiesGet = {
  operation: ["get"],
  resource: ["activities"],
};

export const activitiesGetDescription: INodeProperties[] = [
  {
    displayName: "Activity ID",
    name: "activityId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForActivitiesGet,
    },
    description: "The ID of the activity to retrieve",
  },
];

export async function activitiesGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const activityId = extractResourceLocatorValue(
    this.getNodeParameter("activityId", 0),
  );

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.ACTIVITIES_GET(activityId),
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default activitiesGetDescription;
