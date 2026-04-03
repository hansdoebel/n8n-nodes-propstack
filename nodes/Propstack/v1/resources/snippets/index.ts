import { INodeProperties } from "n8n-workflow";

export const snippetsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["snippets"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many snippets",
        description: "Retrieve a list of email templates",
      },
    ],
    default: "getAll",
  },
];

export const snippetsFields: INodeProperties[] = [
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: {
        resource: ["snippets"],
        operation: ["getAll"],
      },
    },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    displayOptions: {
      show: {
        resource: ["snippets"],
        operation: ["getAll"],
        returnAll: [false],
      },
    },
    description: "Max number of results to return",
    typeOptions: {
      minValue: 1,
    },
  },
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    displayOptions: {
      show: {
        resource: ["snippets"],
        operation: ["getAll"],
      },
    },
    description: "Whether to return a simplified version of the response instead of the raw data",
  },
];

export { snippetsGetAll } from "./getAll";
