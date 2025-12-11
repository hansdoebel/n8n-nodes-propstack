import type { INodeProperties } from "n8n-workflow";
import { relationshipsCreateDescription, relationshipsCreate } from "./create";
import { relationshipsGetAllDescription, relationshipsGetAll } from "./getAll";
import { relationshipsDelete } from "./delete";

export { relationshipsCreate, relationshipsGetAll, relationshipsDelete };

const relationshipIdField: INodeProperties = {
  displayName: "Relationship",
  name: "relationshipId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The relationship to delete",
  displayOptions: {
    show: { resource: ["relationships"], operation: ["delete"] },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: { searchListMethod: "searchRelationships", searchable: true, searchFilterRequired: false },
    },
    { displayName: "By ID", name: "id", type: "string", placeholder: "e.g. 12345" },
  ],
};

export const relationshipsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["relationships"] } },
    options: [
      { name: "Create", value: "create", action: "Create relationship", description: "Create a new relationship" },
      { name: "Delete", value: "delete", action: "Delete relationship", description: "Permanently remove a relationship" },
      { name: "Get Many", value: "getAll", action: "Get many relationships", description: "Retrieve a list of relationships" },
    ],
    default: "getAll",
  },
  relationshipIdField,
  ...relationshipsCreateDescription,
  ...relationshipsGetAllDescription,
];
