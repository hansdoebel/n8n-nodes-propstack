import { INodeProperties } from "n8n-workflow";

export const featuresOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["features"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create feature",
        description: "Create a new feature",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many features",
        description: "Retrieve a list of features",
      },
      {
        name: "Get Parent Features",
        value: "getParentFeatures",
        action: "Get parent features",
        description: "Retrieve a list of parent features",
      },
    ],
    default: "getAll",
  },
];

export const featuresFields: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_clients",
    displayOptions: {
      show: {
        resource: ["features"],
        operation: ["create", "getAll", "getParentFeatures"],
      },
    },
    options: [
      { name: "Activities", value: "for_activities" },
      { name: "Clients", value: "for_clients" },
      { name: "Properties", value: "for_properties" },
    ],
    description: "Entity type",
  },
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["features"],
        operation: ["create"],
      },
    },
    default: "",
    description: "Feature name (must be unique)",
  },
  {
    displayName: "Parent Feature",
    name: "superGroupId",
    type: "resourceLocator",
    default: { mode: "list", value: "" },
    description: "Parent category for this feature",
    displayOptions: {
      show: {
        resource: ["features"],
        operation: ["create"],
      },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchParentFeatures",
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
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["features"],
        operation: ["getAll"],
      },
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
  {
    displayName: "Include Child Features",
    name: "includeGroups",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["features"],
        operation: ["getParentFeatures"],
      },
    },
    description: "Whether to include child features",
  },
];

export { featuresCreate } from "./create";
export { featuresGetAll } from "./getAll";
export { featuresParentGetAll } from "./parentGetAll";
