import { INodeProperties } from "n8n-workflow";

export const portalExportOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["portalExport"],
      },
    },
    options: [
      {
        name: "Publish",
        value: "publish",
        action: "Publish properties to portals",
        description: "Publish properties to portal",
      },
    ],
    default: "publish",
  },
];

export const portalExportFields: INodeProperties[] = [
  {
    displayName: "Property IDs",
    name: "propertyIds",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["portalExport"],
        operation: ["publish"],
      },
    },
    default: "",
    description: "Comma-separated list of property IDs",
  },
  {
    displayName: "Portal IDs",
    name: "portalIds",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["portalExport"],
        operation: ["publish"],
      },
    },
    default: "",
    description: "Comma-separated list of portal IDs",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["portalExport"],
        operation: ["publish"],
      },
    },
    options: [
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "Whether to activate (true) or deactivate (false)",
      },
      {
        displayName: 'Delete From ImmobilienScout24',
        name: "is24Delete",
        type: "boolean",
        default: false,
        description: "Whether to remove objects from ImmobilienScout24",
      },
    ],
  },
];

export { portalExportPublish } from "./publish";
