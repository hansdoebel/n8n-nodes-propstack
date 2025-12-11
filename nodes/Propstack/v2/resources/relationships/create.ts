import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { propstackV2Request } from "../../helpers";

export const relationshipsCreateDescription: INodeProperties[] = [
  {
    displayName: "Internal Name",
    name: "internalName",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["relationships"], operation: ["create"] } },
  },
  {
    displayName: "Client ID",
    name: "relationClientId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["relationships"], operation: ["create"] } },
  },
  {
    displayName: "Related Client ID",
    name: "relatedClientId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["relationships"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["relationships"], operation: ["create"] } },
    options: [
      { displayName: "Name", name: "name", type: "string", default: "" },
      { displayName: "Project ID", name: "project_id", type: "string", default: "" },
      { displayName: "Property ID", name: "property_id", type: "string", default: "" },
    ],
  },
];

export async function relationshipsCreate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const body: Record<string, unknown> = {
    internal_name: this.getNodeParameter("internalName", 0) as string,
    client_id: this.getNodeParameter("relationClientId", 0) as string,
    related_client_id: this.getNodeParameter("relatedClientId", 0) as string,
  };

  const additional = this.getNodeParameter("additionalFields", 0, {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(additional)) {
    if (v !== undefined && v !== "") body[k] = v;
  }

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.RELATIONSHIPS,
    body,
  });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
