import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, extractResourceLocatorValue, propstackRequest, splitCsv, splitCsvInt, toInt } from "../../helpers";

const showForEmailsSend = {
  operation: ["send"],
  resource: ["emails"],
};

export const emailsSendDescription: INodeProperties[] = [
  {
    displayName: "Broker",
    name: "broker_id",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    displayOptions: {
      show: showForEmailsSend,
    },
    description: "Sender user account",
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchBrokers",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 372213",
      },
    ],
  },
  {
    displayName: "To",
    name: "to",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForEmailsSend,
    },
    description: "Recipient email addresses (comma-separated)",
  },
  {
    displayName: "Snippet",
    name: "snippet_id",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    displayOptions: {
      show: showForEmailsSend,
    },
    description: "Email template to send",
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchSnippets",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 924852",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForEmailsSend,
    },
    options: [
      {
        displayName: "BCC",
        name: "bcc",
        type: "string",
        default: "",
        description: "Blind carbon copy email addresses (comma-separated)",
      },
      {
        displayName: "CC",
        name: "cc",
        type: "string",
        default: "",
        description: "Carbon copy email addresses (comma-separated)",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Associated client IDs (comma-separated)",
      },
      {
        displayName: "Client Source ID",
        name: "client_source_id",
        type: "string",
        default: "",
        description: "Client source identifier",
      },
      {
        displayName: "Message Category ID",
        name: "message_category_id",
        type: "string",
        default: "",
        description: "Email type classification",
      },
      {
        displayName: "Project IDs",
        name: "project_ids",
        type: "string",
        default: "",
        description: "Associated project IDs (comma-separated)",
      },
      {
        displayName: "Property IDs",
        name: "property_ids",
        type: "string",
        default: "",
        description: "Associated property IDs (comma-separated)",
      },
    ],
  },
];

export async function emailsSend(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const brokerId = extractResourceLocatorValue(
    this.getNodeParameter("broker_id", 0),
  );
  const snippetId = extractResourceLocatorValue(
    this.getNodeParameter("snippet_id", 0),
  );
  const to = this.getNodeParameter("to", 0) as string;
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body: IDataObject = {
    broker_id: parseInt(brokerId, 10),
    snippet_id: parseInt(snippetId, 10),
    to: to.split(",").map((email) => email.trim()),
    ...buildQs(options, {
      cc: splitCsv("cc"),
      bcc: splitCsv("bcc"),
      client_ids: splitCsvInt("client_ids"),
      property_ids: splitCsvInt("property_ids"),
      project_ids: splitCsvInt("project_ids"),
      message_category_id: toInt("message_category_id"),
      client_source_id: toInt("client_source_id"),
    }),
  };

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.EMAILS_SEND,
    body: { message: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
