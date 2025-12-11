import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForEmailsSend = {
  operation: ["send"],
  resource: ["emails"],
};

export const emailsSendDescription: INodeProperties[] = [
  {
    displayName: "Broker ID",
    name: "broker_id",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForEmailsSend,
    },
    description: "Sender's user ID",
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
    displayName: "Snippet ID",
    name: "snippet_id",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForEmailsSend,
    },
    description: "Template ID to send",
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

function buildEmailsSendBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.broker_id = this.getNodeParameter("broker_id", 0) as string;
  body.snippet_id = this.getNodeParameter("snippet_id", 0) as string;

  const to = this.getNodeParameter("to", 0) as string;
  body.to = to.split(",").map((email) => email.trim());

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    if (options.cc) {
      body.cc = (options.cc as string)
        .split(",")
        .map((email) => email.trim());
    }
    if (options.bcc) {
      body.bcc = (options.bcc as string)
        .split(",")
        .map((email) => email.trim());
    }
    if (options.client_ids) {
      body.client_ids = (options.client_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
    if (options.property_ids) {
      body.property_ids = (options.property_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
    if (options.project_ids) {
      body.project_ids = (options.project_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
    if (options.message_category_id) {
      body.message_category_id = parseInt(
        options.message_category_id as string,
        10,
      );
    }
    if (options.client_source_id) {
      body.client_source_id = parseInt(
        options.client_source_id as string,
        10,
      );
    }
  }

  return body;
}

export async function emailsSend(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildEmailsSendBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.EMAILS_SEND,
    body: { message: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default emailsSendDescription;
