import { INodeProperties } from "n8n-workflow";

export const notesOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["notes"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many notes",
        description: "Retrieve a list of notes",
      },
    ],
    default: "getAll",
  },
];

export const notesFields: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["notes"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker",
        type: "string",
        default: "",
        description: "Filter by user ID assigned to the note",
      },
      {
        displayName: "Client ID",
        name: "client",
        type: "string",
        default: "",
        description: "Filter by contact identifier",
      },
      {
        displayName: "Note Type ID",
        name: "noteType",
        type: "string",
        default: "",
        description: "Filter by note category identifier",
      },
      {
        displayName: "Project ID",
        name: "project",
        type: "string",
        default: "",
        description: "Filter by project identifier",
      },
      {
        displayName: "Property ID",
        name: "property",
        type: "string",
        default: "",
        description: "Filter by object/property identifier",
      },
      {
        displayName: "Tag ID",
        name: "tag",
        type: "string",
        default: "",
        description: "Filter by feature/attribute identifier",
      },
    ],
  },
];

export { notesGetAll } from "./getAll";
