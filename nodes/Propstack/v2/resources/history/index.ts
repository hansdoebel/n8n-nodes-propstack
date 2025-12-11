import type { INodeProperties } from "n8n-workflow";
import { historyGet } from "./get";

export { historyGet };

export const historyDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["history"] } },
    options: [
      { name: "Get", value: "get", action: "Get history entries", description: "Retrieve history entries for an entity" },
    ],
    default: "get",
  },
  {
    displayName: "History Type",
    name: "historyType",
    type: "options",
    required: true,
    displayOptions: { show: { resource: ["history"], operation: ["get"] } },
    options: [
      { name: "Deal", value: "deals" },
      { name: "Event", value: "events" },
      { name: "Message", value: "messages" },
      { name: "Note", value: "notes" },
      { name: "Task", value: "tasks" },
    ],
    default: "messages",
  },
  {
    displayName: "Entity ID",
    name: "entityId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["history"], operation: ["get"] } },
    description: "The ID of the entity to get history for",
  },
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: { show: { resource: ["history"], operation: ["get"] } },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    displayOptions: { show: { resource: ["history"], operation: ["get"], returnAll: [false] } },
    description: "Max number of results to return",
    typeOptions: { minValue: 1, maxValue: 100 },
  },
];
