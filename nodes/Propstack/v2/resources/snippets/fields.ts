import type { INodeProperties } from "n8n-workflow";

export const snippetFieldOptions: INodeProperties[] = [
  { displayName: "Broker ID", name: "broker_id", type: "string", default: "" },
  { displayName: "Broker IDs", name: "broker_ids", type: "string", default: "", description: "Comma-separated list of broker IDs" },
  { displayName: "Department IDs", name: "department_ids", type: "string", default: "", description: "Comma-separated list of department IDs" },
  { displayName: "Is Private", name: "is_private", type: "boolean", default: false, description: "Whether the snippet is private" },
  { displayName: "Message Category ID", name: "message_category_id", type: "string", default: "" },
  { displayName: "Message Template ID", name: "message_template_id", type: "string", default: "" },
  { displayName: "Snippet Category ID", name: "snippet_category_id", type: "string", default: "" },
  { displayName: "Subject", name: "subject", type: "string", default: "" },
];

export const SNIPPET_DIRECT_FIELDS = [
  "broker_id", "is_private", "subject",
  "snippet_category_id", "message_category_id", "message_template_id",
];

export const SNIPPET_CSV_FIELDS = ["broker_ids", "department_ids"];
