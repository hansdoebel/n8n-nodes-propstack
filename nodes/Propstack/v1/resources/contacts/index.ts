import type { INodeProperties } from "n8n-workflow";
import { contactsCreate, contactsCreateDescription } from "./create";
import { contactsGet, contactsGetDescription } from "./get";
import { contactsGetAll, contactsGetAllDescription } from "./getAll";
import { contactsUpdate, contactsUpdateDescription } from "./update";
import { contactsDelete, contactsDeleteDescription } from "./delete";

export {
  contactsCreate,
  contactsDelete,
  contactsGet,
  contactsGetAll,
  contactsUpdate,
};

const contactIdField: INodeProperties = {
  displayName: "Contact",
  name: "contactId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The contact to operate on",
  displayOptions: {
    show: {
      resource: ["contacts"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchContacts",
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

export const contactsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["contacts"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create contact",
        description: "Create a new contact",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete contact",
        description: "Permanently remove a contact",
      },
      {
        name: "Get",
        value: "get",
        action: "Get contact",
        description: "Retrieve a contact",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many contacts",
        description: "Retrieve a list of contacts",
      },
      {
        name: "Update",
        value: "update",
        action: "Update contact",
        description: "Update an existing contact",
      },
    ],
    default: "create",
  },
  contactIdField,
  ...contactsCreateDescription,
  ...contactsGetDescription,
  ...contactsGetAllDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["contacts"],
        operation: ["get", "getAll"],
      },
    },
  },
  ...contactsUpdateDescription,
  ...contactsDeleteDescription,
];
