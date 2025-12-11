import type { INodeProperties } from "n8n-workflow";
import { clientPropertiesCreateDescription, clientPropertiesCreate } from "./create";
import { clientPropertiesGet } from "./get";
import { clientPropertiesGetAllDescription, clientPropertiesGetAll } from "./getAll";
import { clientPropertiesUpdateDescription, clientPropertiesUpdate } from "./update";
import { clientPropertiesDelete } from "./delete";
import { clientPropertiesScrollDescription, clientPropertiesScroll } from "./scroll";

export {
  clientPropertiesCreate,
  clientPropertiesDelete,
  clientPropertiesGet,
  clientPropertiesGetAll,
  clientPropertiesUpdate,
  clientPropertiesScroll,
};

const clientPropertyIdField: INodeProperties = {
  displayName: "Client Property",
  name: "clientPropertyId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The client property (deal) to operate on",
  displayOptions: {
    show: {
      resource: ["clientProperties"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchClientProperties",
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

export const clientPropertiesDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["clientProperties"] },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create client property",
        description: "Create a new client property",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete client property",
        description: "Permanently remove a client property",
      },
      {
        name: "Get",
        value: "get",
        action: "Get client property",
        description: "Retrieve a client property",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many client properties",
        description: "Retrieve a list of client properties",
      },
      {
        name: "Scroll",
        value: "scroll",
        action: "Scroll all client properties",
        description: "Retrieve all client properties using scroll pagination",
      },
      {
        name: "Update",
        value: "update",
        action: "Update client property",
        description: "Update an existing client property",
      },
    ],
    default: "getAll",
  },
  clientPropertyIdField,
  ...clientPropertiesCreateDescription,
  ...clientPropertiesGetAllDescription,
  ...clientPropertiesUpdateDescription,
  ...clientPropertiesScrollDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["clientProperties"],
        operation: ["get", "getAll", "scroll"],
      },
    },
  },
];
