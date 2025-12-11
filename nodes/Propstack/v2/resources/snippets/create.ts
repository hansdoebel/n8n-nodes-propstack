import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import { snippetFieldOptions, SNIPPET_DIRECT_FIELDS, SNIPPET_CSV_FIELDS } from "./fields";

export const snippetsCreateDescription: INodeProperties[] = [
  {
    displayName: "Name",
    name: "snippetName",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["snippets"], operation: ["create"] } },
  },
  {
    displayName: "Body",
    name: "snippetBody",
    type: "string",
    required: true,
    default: "",
    typeOptions: { rows: 4 },
    displayOptions: { show: { resource: ["snippets"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["snippets"], operation: ["create"] } },
    options: snippetFieldOptions,
  },
];

export async function snippetsCreate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const body = buildBody.call(this, "additionalFields", SNIPPET_DIRECT_FIELDS, SNIPPET_CSV_FIELDS);
  body.name = this.getNodeParameter("snippetName", 0) as string;
  body.body = this.getNodeParameter("snippetBody", 0) as string;

  const response = await propstackV2Request.call(this, { method: "POST", url: V2.SNIPPETS, body });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
