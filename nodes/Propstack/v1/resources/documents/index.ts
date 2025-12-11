import type { INodeProperties } from "n8n-workflow";
import { documentsCreate, documentsCreateDescription } from "./create";
import { documentsGet, documentsGetDescription } from "./get";
import { documentsGetAll, documentsGetAllDescription } from "./getAll";
import { documentsUpdate, documentsUpdateDescription } from "./update";
import { documentsDelete, documentsDeleteDescription } from "./delete";

export {
  documentsCreate,
  documentsDelete,
  documentsGet,
  documentsGetAll,
  documentsUpdate,
};

const documentIdField: INodeProperties = {
  displayName: "Document",
  name: "documentId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The document to operate on",
  displayOptions: {
    show: {
      resource: ["documents"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchDocuments",
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

export const documentsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["documents"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create document",
        description: "Create a new document",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete document",
        description: "Permanently remove a document",
      },
      {
        name: "Get",
        value: "get",
        action: "Get document",
        description: "Retrieve a document",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many documents",
        description: "Retrieve a list of documents",
      },
      {
        name: "Update",
        value: "update",
        action: "Update document",
        description: "Update an existing document",
      },
    ],
    default: "create",
  },
  documentIdField,
  ...documentsCreateDescription,
  ...documentsGetDescription,
  ...documentsGetAllDescription,
  ...documentsUpdateDescription,
  ...documentsDeleteDescription,
];
