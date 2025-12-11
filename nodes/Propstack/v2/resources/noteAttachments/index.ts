import type { INodeProperties } from "n8n-workflow";
import { noteAttachmentsCreateDescription, noteAttachmentsCreate } from "./create";

export { noteAttachmentsCreate };

export const noteAttachmentsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["noteAttachments"] } },
    options: [
      { name: "Create", value: "create", action: "Upload note attachment", description: "Upload a new note attachment" },
    ],
    default: "create",
  },
  ...noteAttachmentsCreateDescription,
];
