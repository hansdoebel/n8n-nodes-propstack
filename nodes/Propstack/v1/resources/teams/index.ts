import { INodeProperties } from "n8n-workflow";

export const teamsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["teams"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many teams",
        description: "Retrieve a list of teams",
      },
    ],
    default: "getAll",
  },
];

export const teamsFields: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    description: "Whether to return all results or only up to a given limit",
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["getAll"],
      },
    },
    default: false,
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    description: "Max number of results to return",
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["getAll"],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
  },
];

export { teamsGetAll } from "./getAll";
