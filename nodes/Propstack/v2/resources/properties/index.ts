import type { INodeProperties } from "n8n-workflow";
import { propertiesCreateDescription, propertiesCreate } from "./create";
import { propertiesGet } from "./get";
import { propertiesGetAllDescription, propertiesGetAll } from "./getAll";
import { propertiesUpdateDescription, propertiesUpdate } from "./update";
import { propertiesDelete } from "./delete";
import { propertiesScrollDescription, propertiesScroll } from "./scroll";
import { propertiesGetDeletedDescription, propertiesGetDeleted } from "./getDeleted";
import { propertiesGetOptionsDescription, propertiesGetOptions } from "./getOptions";
import { propertiesCreateLinkDescription, propertiesCreateLink } from "./createLink";
import { propertiesUpdateLinkDescription, propertiesUpdateLink } from "./updateLink";
import { propertiesDeleteLinkDescription, propertiesDeleteLink } from "./deleteLink";

export {
  propertiesCreate,
  propertiesDelete,
  propertiesGet,
  propertiesGetAll,
  propertiesUpdate,
  propertiesScroll,
  propertiesGetDeleted,
  propertiesGetOptions,
  propertiesCreateLink,
  propertiesUpdateLink,
  propertiesDeleteLink,
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
      operation: ["get", "update", "delete", "createLink", "updateLink", "deleteLink"],
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
        name: "Create Link",
        value: "createLink",
        action: "Create property link",
        description: "Create a link on a property",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete property",
        description: "Permanently remove a property",
      },
      {
        name: "Delete Link",
        value: "deleteLink",
        action: "Delete property link",
        description: "Remove a link from a property",
      },
      {
        name: "Get",
        value: "get",
        action: "Get property",
        description: "Retrieve a property",
      },
      {
        name: "Get Deleted",
        value: "getDeleted",
        action: "Get deleted properties",
        description: "Retrieve deleted properties",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many properties",
        description: "Retrieve a list of properties",
      },
      {
        name: "Get Options",
        value: "getOptions",
        action: "Get property options",
        description: "Retrieve available property field options",
      },
      {
        name: "Scroll",
        value: "scroll",
        action: "Scroll all properties",
        description: "Retrieve all properties using scroll pagination",
      },
      {
        name: "Update",
        value: "update",
        action: "Update property",
        description: "Update an existing property",
      },
      {
        name: "Update Link",
        value: "updateLink",
        action: "Update property link",
        description: "Update a link on a property",
      },
    ],
    default: "getAll",
  },
  propertyIdField,
  ...propertiesCreateDescription,
  ...propertiesGetAllDescription,
  ...propertiesUpdateDescription,
  ...propertiesScrollDescription,
  ...propertiesGetDeletedDescription,
  ...propertiesGetOptionsDescription,
  ...propertiesCreateLinkDescription,
  ...propertiesUpdateLinkDescription,
  ...propertiesDeleteLinkDescription,
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
        operation: ["get", "getAll", "scroll", "getDeleted", "getOptions"],
      },
    },
  },
];
