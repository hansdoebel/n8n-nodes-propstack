import type { INodeProperties } from "n8n-workflow";
import { brokersCreateDescription, brokersCreate } from "./create";
import { brokersGet } from "./get";
import { brokersGetAllDescription, brokersGetAll } from "./getAll";
import { brokersUpdateDescription, brokersUpdate } from "./update";

export { brokersCreate, brokersGet, brokersGetAll, brokersUpdate };

const brokerIdField: INodeProperties = {
  displayName: "Broker",
  name: "brokerId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The broker to operate on",
  displayOptions: {
    show: { resource: ["brokers"], operation: ["get", "update"] },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: { searchListMethod: "searchBrokers", searchable: true, searchFilterRequired: false },
    },
    { displayName: "By ID", name: "id", type: "string", placeholder: "e.g. 12345" },
  ],
};

export const brokersDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["brokers"] } },
    options: [
      { name: "Create", value: "create", action: "Create broker", description: "Create a new broker" },
      { name: "Get", value: "get", action: "Get broker", description: "Retrieve a broker" },
      { name: "Get Many", value: "getAll", action: "Get many brokers", description: "Retrieve a list of brokers" },
      { name: "Update", value: "update", action: "Update broker", description: "Update an existing broker" },
    ],
    default: "getAll",
  },
  brokerIdField,
  ...brokersCreateDescription,
  ...brokersGetAllDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["brokers"],
        operation: ["get", "getAll"],
      },
    },
  },
  ...brokersUpdateDescription,
];
