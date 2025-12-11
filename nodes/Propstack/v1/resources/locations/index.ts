import { INodeProperties } from "n8n-workflow";

export const locationsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["locations"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many locations",
        description: "Retrieve a list of locations",
      },
    ],
    default: "getAll",
  },
];

export const locationsFields: INodeProperties[] = [];

export { locationsGetAll } from "./getAll";
