import type { INodeProperties } from "n8n-workflow";
import { snippetsCreateDescription, snippetsCreate } from "./create";
import { snippetsGetAllDescription, snippetsGetAll } from "./getAll";
import { snippetsUpdateDescription, snippetsUpdate } from "./update";
import { snippetsDelete } from "./delete";
import { snippetsAddAttachmentDescription, snippetsAddAttachment } from "./addAttachment";

export { snippetsCreate, snippetsGetAll, snippetsUpdate, snippetsDelete, snippetsAddAttachment };

const snippetIdField: INodeProperties = {
  displayName: "Snippet",
  name: "snippetId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The snippet to operate on",
  displayOptions: {
    show: { resource: ["snippets"], operation: ["update", "delete", "addAttachment"] },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: { searchListMethod: "searchSnippets", searchable: true, searchFilterRequired: false },
    },
    { displayName: "By ID", name: "id", type: "string", placeholder: "e.g. 12345" },
  ],
};

export const snippetsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["snippets"] } },
    options: [
      { name: "Add Attachment", value: "addAttachment", action: "Add attachment to snippet", description: "Add an attachment to a snippet" },
      { name: "Create", value: "create", action: "Create snippet", description: "Create a new snippet" },
      { name: "Delete", value: "delete", action: "Delete snippet", description: "Permanently remove a snippet" },
      { name: "Get Many", value: "getAll", action: "Get many snippets", description: "Retrieve a list of snippets" },
      { name: "Update", value: "update", action: "Update snippet", description: "Update an existing snippet" },
    ],
    default: "getAll",
  },
  snippetIdField,
  ...snippetsCreateDescription,
  ...snippetsGetAllDescription,
  ...snippetsUpdateDescription,
  ...snippetsAddAttachmentDescription,
];
