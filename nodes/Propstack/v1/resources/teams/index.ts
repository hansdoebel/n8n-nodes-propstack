import { INodeProperties } from "n8n-workflow";

export const teamsOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["teams"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create team",
        description: "Create a new team",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete team",
        description: "Permanently remove a team",
      },
      {
        name: "Get",
        value: "get",
        action: "Get team",
        description: "Retrieve a team",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many teams",
        description: "Retrieve a list of teams",
      },
      {
        name: "Update",
        value: "update",
        action: "Update team",
        description: "Update an existing team",
      },
    ],
    default: "getAll",
  },
];

export const teamsFields: INodeProperties[] = [
  {
    displayName: "Team",
    name: "teamId",
    type: "resourceLocator",
    required: true,
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["get", "update", "delete"],
      },
    },
    default: { mode: "list", value: "" },
    description: "The team to operate on",
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchTeams",
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
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["create"],
      },
    },
    default: "",
    description: "Department name",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["create"],
      },
    },
    options: [
      {
        displayName: "Broker IDs",
        name: "broker_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of broker IDs",
      },
      {
        displayName: "Cancellation Policy Note",
        name: "cancellation_policy_note",
        type: "string",
        default: "",
        description: "Cancellation terms (HTML)",
      },
      {
        displayName: "Imprint Note",
        name: "imprint_note",
        type: "string",
        default: "",
        description: "Legal imprint (HTML)",
      },
      {
        displayName: "Logo URL",
        name: "logo_url",
        type: "string",
        default: "",
        description: "Logo image URL",
      },
      {
        displayName: "Position",
        name: "position",
        type: "number",
        default: 0,
        description: "Display order",
      },
      {
        displayName: "Privacy Note",
        name: "privacy_note",
        type: "string",
        default: "",
        description: "Privacy policy (HTML)",
      },
      {
        displayName: "Terms Note",
        name: "terms_note",
        type: "string",
        default: "",
        description: "Terms of service (HTML)",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["update"],
      },
    },
    options: [
      {
        displayName: "Broker IDs",
        name: "broker_ids",
        type: "string",
        default: "",
        description: "Comma-separated list of broker IDs",
      },
      {
        displayName: "Cancellation Policy Note",
        name: "cancellation_policy_note",
        type: "string",
        default: "",
        description: "Cancellation terms (HTML)",
      },
      {
        displayName: "Imprint Note",
        name: "imprint_note",
        type: "string",
        default: "",
        description: "Legal imprint (HTML)",
      },
      {
        displayName: "Logo URL",
        name: "logo_url",
        type: "string",
        default: "",
        description: "Logo image URL",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "Department name",
      },
      {
        displayName: "Position",
        name: "position",
        type: "number",
        default: 0,
        description: "Display order",
      },
      {
        displayName: "Privacy Note",
        name: "privacy_note",
        type: "string",
        default: "",
        description: "Privacy policy (HTML)",
      },
      {
        displayName: "Terms Note",
        name: "terms_note",
        type: "string",
        default: "",
        description: "Terms of service (HTML)",
      },
    ],
  },
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    description: "Whether to return all results or only up to a given limit",
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["getAll"],
      },
    },
    default: false,
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    description: "Max number of results to return",
    displayOptions: {
      show: {
        resource: ["teams"],
        operation: ["getAll"],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
  },
];

export { teamsCreate } from "./create";
export { teamsDelete } from "./delete";
export { teamsGet } from "./get";
export { teamsGetAll } from "./getAll";
export { teamsUpdate } from "./update";
