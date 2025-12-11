import { INodeProperties } from "n8n-workflow";

export const customFieldsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["customFields"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many custom field groups",
        description: "Retrieve a list of custom field groups",
      },
    ],
    default: "getAll",
  },
];

export const customFieldsFields: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_properties",
    displayOptions: {
      show: {
        resource: ["customFields"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        name: "Brokers",
        value: "for_brokers",
      },
      {
        name: "Clients",
        value: "for_clients",
      },
      {
        name: "Deals",
        value: "for_deals",
      },
      {
        name: "Projects",
        value: "for_projects",
      },
      {
        name: "Properties",
        value: "for_properties",
      },
      {
        name: "Tasks",
        value: "for_tasks",
      },
    ],
    description: "Entity type to retrieve custom field groups for",
  },
];

export { customFieldsGetAll } from "./getAll";
