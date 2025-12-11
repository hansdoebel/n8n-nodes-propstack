import { INodeProperties } from "n8n-workflow";

export const brokersOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["brokers"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many brokers",
        description: "Retrieve a list of brokers",
      },
    ],
    default: "getAll",
  },
];

export const brokersFields: INodeProperties[] = [];

export { brokersGetAll } from "./getAll";
