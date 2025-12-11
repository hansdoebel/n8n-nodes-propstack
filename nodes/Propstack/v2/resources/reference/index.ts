import type { INodeProperties } from "n8n-workflow";

export { referenceGetAll } from "./getAll";

export const referenceDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["referenceData"],
      },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many reference data entries",
        description: "Retrieve a list of reference data entries",
      },
    ],
    default: "getAll",
  },
  {
    displayName: "Reference Type",
    name: "referenceType",
    type: "options",
    required: true,
    displayOptions: {
      show: {
        resource: ["referenceData"],
        operation: ["getAll"],
      },
    },
    options: [
      { name: "Client Source", value: "clientSources" },
      { name: "Client Status", value: "clientStatuses" },
      { name: "Comment", value: "comments" },
      { name: "Folder", value: "folders" },
      { name: "Group", value: "groups" },
      { name: "Message Tracking", value: "messageTrackings" },
      { name: "Portal", value: "portals" },
      { name: "Property Status", value: "propertyStatuses" },
      { name: "Publishing", value: "publishings" },
      { name: "Recipe", value: "recipes" },
      { name: "Right", value: "rights" },
      { name: "Snippet Category", value: "snippetCategories" },
    ],
    default: "propertyStatuses",
  },
];
