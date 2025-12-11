import type { INodeProperties } from "n8n-workflow";
import { customFieldsCreateDescription, customFieldsCreate } from "./create";
import { customFieldsGet } from "./get";
import { customFieldsGetAllDescription, customFieldsGetAll } from "./getAll";
import { customFieldsUpdateDescription, customFieldsUpdate } from "./update";
import { customFieldsDelete } from "./delete";
import { customFieldsCreateOptionDescription, customFieldsCreateOption } from "./createOption";
import { customFieldsDeleteOptionDescription, customFieldsDeleteOption } from "./deleteOption";

export {
  customFieldsCreate, customFieldsDelete, customFieldsGet,
  customFieldsGetAll, customFieldsUpdate,
  customFieldsCreateOption, customFieldsDeleteOption,
};

const customFieldIdField: INodeProperties = {
  displayName: "Custom Field",
  name: "customFieldId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The custom field to operate on",
  displayOptions: {
    show: { resource: ["customFields"], operation: ["get", "update", "delete", "createOption", "deleteOption"] },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: { searchListMethod: "searchCustomFields", searchable: true, searchFilterRequired: false },
    },
    { displayName: "By ID", name: "id", type: "string", placeholder: "e.g. 12345" },
  ],
};

export const customFieldsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["customFields"] } },
    options: [
      { name: "Create", value: "create", action: "Create custom field", description: "Create a new custom field" },
      { name: "Create Option", value: "createOption", action: "Add option to custom field", description: "Add an option to a custom field" },
      { name: "Delete", value: "delete", action: "Delete custom field", description: "Permanently remove a custom field" },
      { name: "Delete Option", value: "deleteOption", action: "Delete option from custom field", description: "Remove an option from a custom field" },
      { name: "Get", value: "get", action: "Get custom field", description: "Retrieve a custom field" },
      { name: "Get Many", value: "getAll", action: "Get many custom fields", description: "Retrieve a list of custom fields" },
      { name: "Update", value: "update", action: "Update custom field", description: "Update an existing custom field" },
    ],
    default: "getAll",
  },
  customFieldIdField,
  ...customFieldsCreateDescription,
  ...customFieldsGetAllDescription,
  ...customFieldsUpdateDescription,
  ...customFieldsCreateOptionDescription,
  ...customFieldsDeleteOptionDescription,
];
