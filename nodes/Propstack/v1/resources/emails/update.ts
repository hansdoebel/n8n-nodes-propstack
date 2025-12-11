import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForEmailsUpdate = {
  operation: ["update"],
  resource: ["emails"],
};

export const emailsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForEmailsUpdate,
    },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        description: "Whether to archive the email",
      },
      {
        displayName: "Client IDs",
        name: "client_ids",
        type: "string",
        default: "",
        description: "Associated client IDs (comma-separated)",
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
      {
        displayName: "Read",
        name: "read",
        type: "boolean",
        default: false,
        description: "Whether to mark the email as read",
      },
    ],
  },
];

function buildEmailsUpdateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    if (
      options.read !== undefined && options.read !== ""
    ) {
      body.read = options.read;
    }
    if (
      options.archived !== undefined &&
      options.archived !== ""
    ) {
      body.archived = options.archived;
    }
    if (options.message_category_id) {
      body.message_category_id = parseInt(
        options.message_category_id as string,
        10,
      );
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
  }

  return body;
}

export async function emailsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const emailId = extractResourceLocatorValue(
    this.getNodeParameter("emailId", 0),
  );
  const body = buildEmailsUpdateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.EMAILS_UPDATE(emailId),
    body: { message: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default emailsUpdateDescription;
