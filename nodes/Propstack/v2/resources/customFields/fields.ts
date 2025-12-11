import type { INodeProperties } from "n8n-workflow";

export const customFieldFieldOptions: INodeProperties[] = [
  { displayName: "Bequest", name: "bequest", type: "string", default: "" },
  { displayName: "Entity", name: "entity", type: "string", default: "" },
  { displayName: "Export to OpenImmo", name: "export_to_openimmo", type: "boolean", default: false, description: "Whether to export this field to OpenImmo" },
  { displayName: "Field Type", name: "field_type", type: "string", default: "" },
  { displayName: "Formula", name: "formula", type: "string", default: "" },
  { displayName: "Pretty Name", name: "pretty_name", type: "string", default: "" },
  { displayName: "Unit", name: "unit", type: "string", default: "" },
  { displayName: "Use in Search Profile", name: "use_in_search_profile", type: "boolean", default: false, description: "Whether to use this field in search profiles" },
];

export const CF_DIRECT_FIELDS = [
  "pretty_name", "field_type", "entity", "unit",
  "export_to_openimmo", "use_in_search_profile", "formula", "bequest",
];
