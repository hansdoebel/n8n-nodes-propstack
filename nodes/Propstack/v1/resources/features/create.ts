import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForFeaturesCreate = {
  operation: ["create"],
  resource: ["features"],
};

export const featuresCreateDescription: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_clients",
    displayOptions: {
      show: showForFeaturesCreate,
    },
    options: [
      { name: "Activities", value: "for_activities" },
      { name: "Clients", value: "for_clients" },
      { name: "Properties", value: "for_properties" },
    ],
    description: "Entity type for the feature",
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForFeaturesCreate,
    },
    description: "Feature name (must be unique)",
  },
  {
    displayName: "Parent Feature ID",
    name: "superGroupId",
    type: "string",
    default: "",
    displayOptions: {
      show: showForFeaturesCreate,
    },
    description: "Parent category ID",
  },
];

function buildFeaturesCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.entity = this.getNodeParameter("entity", 0) as string;
  body.name = this.getNodeParameter("name", 0) as string;

  const superGroupId = extractResourceLocatorValue(
    this.getNodeParameter("superGroupId", 0),
  );
  if (superGroupId) {
    body.super_group_id = parseInt(superGroupId, 10);
  }

  return body;
}

export async function featuresCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildFeaturesCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.FEATURES_CREATE,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default featuresCreateDescription;
