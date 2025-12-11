import type { INodeProperties } from "n8n-workflow";
import { propertiesCreate, propertiesCreateDescription } from "./create";
import { propertiesGet, propertiesGetDescription } from "./get";
import { propertiesGetAll, propertiesGetAllDescription } from "./getAll";
import { propertiesUpdate, propertiesUpdateDescription } from "./update";
import { propertiesDelete, propertiesDeleteDescription } from "./delete";

export {
  propertiesCreate,
  propertiesDelete,
  propertiesGet,
  propertiesGetAll,
  propertiesUpdate,
};

const propertyIdField: INodeProperties = {
  displayName: "Property",
  name: "propertyId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The property to operate on",
  displayOptions: {
    show: {
      resource: ["properties"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchProperties",
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

export const propertiesDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["properties"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create property",
        description: "Create a new property",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete property",
        description: "Permanently remove a property",
      },
      {
        name: "Get",
        value: "get",
        action: "Get property",
        description: "Retrieve a property",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many properties",
        description: "Retrieve a list of properties",
      },
      {
        name: "Update",
        value: "update",
        action: "Update property",
        description: "Update an existing property",
      },
    ],
    default: "create",
  },
  propertyIdField,
  ...propertiesCreateDescription,
  ...propertiesGetDescription,
  ...propertiesGetAllDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["properties"],
        operation: ["get", "getAll"],
      },
    },
  },
  ...propertiesUpdateDescription,
  ...propertiesDeleteDescription,
];
