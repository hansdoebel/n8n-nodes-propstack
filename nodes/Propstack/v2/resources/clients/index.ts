import type { INodeProperties } from "n8n-workflow";
import { clientsCreateDescription, clientsCreate } from "./create";
import { clientsGet } from "./get";
import { clientsGetAllDescription, clientsGetAll } from "./getAll";
import { clientsUpdateDescription, clientsUpdate } from "./update";
import { clientsDelete } from "./delete";
import { clientsScrollDescription, clientsScroll } from "./scroll";
import { clientsGetDeletedDescription, clientsGetDeleted } from "./getDeleted";

export {
  clientsCreate,
  clientsDelete,
  clientsGet,
  clientsGetAll,
  clientsUpdate,
  clientsScroll,
  clientsGetDeleted,
};

const clientIdField: INodeProperties = {
  displayName: "Client",
  name: "clientId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The client to operate on",
  displayOptions: {
    show: {
      resource: ["clients"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchClients",
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
};

export const clientsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["clients"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create client",
        description: "Create a new client",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete client",
        description: "Permanently remove a client",
      },
      {
        name: "Get",
        value: "get",
        action: "Get client",
        description: "Retrieve a client",
      },
      {
        name: "Get Deleted",
        value: "getDeleted",
        action: "Get deleted clients",
        description: "Retrieve deleted clients",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many clients",
        description: "Retrieve a list of clients",
      },
      {
        name: "Scroll",
        value: "scroll",
        action: "Scroll all clients",
        description: "Retrieve all clients using scroll pagination",
      },
      {
        name: "Update",
        value: "update",
        action: "Update client",
        description: "Update an existing client",
      },
    ],
    default: "getAll",
  },
  clientIdField,
  ...clientsCreateDescription,
  ...clientsGetAllDescription,
  ...clientsUpdateDescription,
  ...clientsScrollDescription,
  ...clientsGetDeletedDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["clients"],
        operation: ["get", "getAll", "scroll", "getDeleted"],
      },
    },
  },
];
