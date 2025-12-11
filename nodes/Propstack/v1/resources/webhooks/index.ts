import { INodeProperties } from "n8n-workflow";
import { webhooksCreate } from "./create";
import { webhooksDelete } from "./delete";
import { webhooksGetAll } from "./getAll";

export { webhooksCreate, webhooksDelete, webhooksGetAll };

export const webhooksOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["webhooks"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create webhook",
        description: "Create a new webhook",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete webhook",
        description: "Permanently remove a webhook",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many webhooks",
        description: "Retrieve a list of webhooks",
      },
    ],
    default: "getAll",
  },
];

export const webhooksFields: INodeProperties[] = [
  {
    displayName: "Webhook",
    name: "id",
    type: "resourceLocator",
    displayOptions: {
      show: {
        resource: ["webhooks"],
        operation: ["delete"],
      },
    },
    required: true,
    default: { mode: "list", value: "" },
    description: "The webhook to delete",
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchWebhooks",
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
    displayName: "Target URL",
    name: "targetUrl",
    type: "string",
    displayOptions: {
      show: {
        resource: ["webhooks"],
        operation: ["create"],
      },
    },
    required: true,
    default: "",
    description: "The endpoint to be invoked when the webhook triggers",
  },
  {
    displayName: "Event",
    name: "event",
    type: "options",
    displayOptions: {
      show: {
        resource: ["webhooks"],
        operation: ["create"],
      },
    },
    required: true,
    default: "client_created",
    options: [
      { name: "Client Created", value: "client_created" },
      { name: "Client Property Created", value: "client_property_created" },
      { name: "Client Property Deleted", value: "client_property_deleted" },
      { name: "Client Property Updated", value: "client_property_updated" },
      { name: "Client Updated", value: "client_updated", description: "Also fires on delete" },
      { name: "Document Created", value: "document_created" },
      { name: "Document Deleted", value: "document_deleted" },
      { name: "Document Updated", value: "document_updated" },
      { name: "Project Created", value: "project_created" },
      { name: "Project Updated", value: "project_updated" },
      { name: "Property Created", value: "property_created" },
      { name: "Property Updated", value: "property_updated", description: "Also fires on delete" },
      { name: "Saved Query Created", value: "saved_query_created" },
      { name: "Saved Query Deleted", value: "saved_query_deleted" },
      { name: "Saved Query Updated", value: "saved_query_updated" },
      { name: "Task Created", value: "task_created" },
      { name: "Task Deleted", value: "task_deleted" },
      { name: "Task Updated", value: "task_updated" },
    ],
    description: "The event type to listen for",
  },
];
