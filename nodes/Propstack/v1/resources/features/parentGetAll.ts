import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForFeaturesParentGetAll = {
  operation: ["getParentFeatures"],
  resource: ["features"],
};

export const featuresParentGetAllDescription: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_clients",
    displayOptions: {
      show: showForFeaturesParentGetAll,
    },
    options: [
      { name: "Activities", value: "for_activities" },
      { name: "Clients", value: "for_clients" },
      { name: "Properties", value: "for_properties" },
    ],
    description: "Entity type to retrieve parent features for",
  },
  {
    displayName: "Include Child Features",
    name: "includeGroups",
    type: "boolean",
    default: false,
    displayOptions: {
      show: showForFeaturesParentGetAll,
    },
    description: "Whether to include child features",
  },
];

export async function featuresParentGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const entity = this.getNodeParameter("entity", 0) as string;
  const includeGroups = this.getNodeParameter("includeGroups", 0) as boolean;

  const qs: IDataObject = {
    entity,
  };

  if (includeGroups) {
    qs.include = "groups";
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.FEATURES_PARENT_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default featuresParentGetAllDescription;
