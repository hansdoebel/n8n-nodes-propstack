import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForNotesGetAll = {
  operation: ["getAll"],
  resource: ["notes"],
};

export const notesGetAllDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForNotesGetAll,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker",
        type: "string",
        default: "",
        description: "Filter by user ID assigned to the note",
      },
      {
        displayName: "Client ID",
        name: "client",
        type: "string",
        default: "",
        description: "Filter by contact identifier",
      },
      {
        displayName: "Note Type ID",
        name: "noteType",
        type: "string",
        default: "",
        description: "Filter by note category identifier",
      },
      {
        displayName: "Project ID",
        name: "project",
        type: "string",
        default: "",
        description: "Filter by project identifier",
      },
      {
        displayName: "Property ID",
        name: "property",
        type: "string",
        default: "",
        description: "Filter by object/property identifier",
      },
      {
        displayName: "Tag ID",
        name: "tag",
        type: "string",
        default: "",
        description: "Filter by feature/attribute identifier",
      },
    ],
  },
];

export async function notesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs: IDataObject = {};

  if (options) {
    if (options.broker) {
      qs.broker = parseInt(options.broker as string, 10);
    }
    if (options.client) {
      qs.client = parseInt(options.client as string, 10);
    }
    if (options.noteType) {
      qs.note_type = parseInt(options.noteType as string, 10);
    }
    if (options.property) {
      qs.property = parseInt(options.property as string, 10);
    }
    if (options.project) {
      qs.project = parseInt(options.project as string, 10);
    }
    if (options.tag) {
      qs.tag = parseInt(options.tag as string, 10);
    }
  }

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.NOTES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default notesGetAllDescription;
