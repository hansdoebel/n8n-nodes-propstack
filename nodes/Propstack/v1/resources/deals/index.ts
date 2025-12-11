import type { INodeProperties } from "n8n-workflow";
import { dealsCreate, dealsCreateDescription } from "./create";
import { dealsGet, dealsGetDescription } from "./get";
import { dealsGetAll, dealsGetAllDescription } from "./getAll";
import { dealsUpdate, dealsUpdateDescription } from "./update";
import { dealsDelete, dealsDeleteDescription } from "./delete";

export { dealsCreate, dealsDelete, dealsGet, dealsGetAll, dealsUpdate };

const dealIdField: INodeProperties = {
  displayName: "Deal",
  name: "dealId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The deal to operate on",
  displayOptions: {
    show: {
      resource: ["deals"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchDeals",
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

export const dealsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["deals"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create deal",
        description: "Create a new deal",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete deal",
        description: "Permanently remove a deal",
      },
      {
        name: "Get",
        value: "get",
        action: "Get deal",
        description: "Retrieve a deal",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many deals",
        description: "Retrieve a list of deals",
      },
      {
        name: "Update",
        value: "update",
        action: "Update deal",
        description: "Update an existing deal",
      },
    ],
    default: "create",
  },
  dealIdField,
  ...dealsCreateDescription,
  ...dealsGetDescription,
  ...dealsGetAllDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["deals"],
        operation: ["get", "getAll"],
      },
    },
  },
  ...dealsUpdateDescription,
  ...dealsDeleteDescription,
];
