import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForFeaturesGetAll = {
  operation: ["getAll"],
  resource: ["features"],
};

export const featuresGetAllDescription: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_clients",
    displayOptions: {
      show: showForFeaturesGetAll,
    },
    options: [
      { name: "Activities", value: "for_activities" },
      { name: "Clients", value: "for_clients" },
      { name: "Properties", value: "for_properties" },
    ],
    description: "Entity type to retrieve features for",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForFeaturesGetAll,
    },
    options: [
      {
        displayName: "Parent Feature ID",
        name: "superGroupId",
        type: "string",
        default: "",
        description: "Filter by parent category ID",
      },
    ],
  },
];

export async function featuresGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const entity = this.getNodeParameter("entity", 0) as string;
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {
    entity,
  };

  if (options?.superGroupId) {
    qs.super_group = parseInt(options.superGroupId as string, 10);
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.FEATURES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default featuresGetAllDescription;
