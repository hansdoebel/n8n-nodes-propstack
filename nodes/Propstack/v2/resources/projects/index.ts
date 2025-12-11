import type { INodeProperties } from "n8n-workflow";
import { projectsCreateDescription, projectsCreate } from "./create";
import { projectsGet } from "./get";
import { projectsGetAllDescription, projectsGetAll } from "./getAll";
import { projectsUpdateDescription, projectsUpdate } from "./update";
import { projectsDelete } from "./delete";

export {
  projectsCreate,
  projectsDelete,
  projectsGet,
  projectsGetAll,
  projectsUpdate,
};

const projectIdField: INodeProperties = {
  displayName: "Project",
  name: "projectId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The project to operate on",
  displayOptions: {
    show: {
      resource: ["projects"],
      operation: ["get", "update", "delete"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchProjects",
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

export const projectsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["projects"] },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create project",
        description: "Create a new project",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete project",
        description: "Permanently remove a project",
      },
      {
        name: "Get",
        value: "get",
        action: "Get project",
        description: "Retrieve a project",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many projects",
        description: "Retrieve a list of projects",
      },
      {
        name: "Update",
        value: "update",
        action: "Update project",
        description: "Update an existing project",
      },
    ],
    default: "getAll",
  },
  projectIdField,
  ...projectsCreateDescription,
  ...projectsGetAllDescription,
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    description:
      "Whether to return a simplified version of the response instead of the raw data",
    displayOptions: {
      show: {
        resource: ["projects"],
        operation: ["get", "getAll"],
      },
    },
  },
  ...projectsUpdateDescription,
];
