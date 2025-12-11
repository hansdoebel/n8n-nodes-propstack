import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { propstackV2Request } from "../../helpers";

export const noteAttachmentsCreateDescription: INodeProperties[] = [
  {
    displayName: "File (Base64)",
    name: "file",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["noteAttachments"], operation: ["create"] } },
  },
  {
    displayName: "Filename",
    name: "filename",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["noteAttachments"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["noteAttachments"], operation: ["create"] } },
    options: [
      { displayName: "Note ID", name: "note_id", type: "string", default: "" },
    ],
  },
];

export async function noteAttachmentsCreate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const body: Record<string, unknown> = {
    file: this.getNodeParameter("file", 0) as string,
    filename: this.getNodeParameter("filename", 0) as string,
  };

  const additional = this.getNodeParameter("additionalFields", 0, {}) as Record<string, unknown>;
  if (additional.note_id) body.note_id = additional.note_id;

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.NOTE_ATTACHMENTS,
    body,
  });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
