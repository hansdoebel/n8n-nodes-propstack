import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export const snippetsAddAttachmentDescription: INodeProperties[] = [
  {
    displayName: "File (Base64)",
    name: "file",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["snippets"], operation: ["addAttachment"] } },
  },
  {
    displayName: "Filename",
    name: "filename",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["snippets"], operation: ["addAttachment"] } },
  },
];

export async function snippetsAddAttachment(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const snippetId = extractResourceLocatorValue(this.getNodeParameter("snippetId", 0));
  const file = this.getNodeParameter("file", 0) as string;
  const filename = this.getNodeParameter("filename", 0) as string;

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.SNIPPET_ATTACHMENTS(snippetId),
    body: { file, filename },
  });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
