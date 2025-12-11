import { INodeProperties } from "n8n-workflow";

export const dealPipelinesOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["dealPipelines"],
      },
    },
    options: [
      {
        name: "Get",
        value: "get",
        action: "Get deal pipeline",
        description: "Retrieve a deal pipeline",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many deal pipelines",
        description: "Retrieve a list of deal pipelines",
      },
    ],
    default: "getAll",
  },
];

const pipelineIdField: INodeProperties = {
  displayName: "Pipeline",
  name: "pipelineId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The pipeline to operate on",
  displayOptions: {
    show: {
      resource: ["dealPipelines"],
      operation: ["get"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchDealPipelines",
        searchable: true,
        searchFilterRequired: false,
      },
    },
    {
      displayName: "By ID",
      name: "id",
      type: "string",
      placeholder: "e.g. 12345",
    },
  ],
};

export const dealPipelinesFields: INodeProperties[] = [
  pipelineIdField,
];

export { dealPipelinesGet } from "./get";
export { dealPipelinesGetAll } from "./getAll";
