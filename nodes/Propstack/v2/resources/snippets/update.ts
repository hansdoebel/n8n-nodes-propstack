import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { snippetFieldOptions, SNIPPET_DIRECT_FIELDS, SNIPPET_CSV_FIELDS } from "./fields";

export const snippetsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["snippets"], operation: ["update"] } },
    options: [
      { displayName: "Body", name: "body", type: "string", default: "", typeOptions: { rows: 4 } },
      { displayName: "Name", name: "name", type: "string", default: "" },
      ...snippetFieldOptions,
    ],
  },
];

export async function snippetsUpdate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(this.getNodeParameter("snippetId", 0));
  const body = buildBody.call(this, "additionalFields", [...SNIPPET_DIRECT_FIELDS, "name", "body"], SNIPPET_CSV_FIELDS);
  const response = await propstackV2Request.call(this, { method: "PUT", url: V2.SNIPPET(id), body });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
