import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, extractResourceLocatorValue, propstackRequest, splitCsvInt, toInt } from "../../helpers";

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

export async function emailsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const emailId = extractResourceLocatorValue(
    this.getNodeParameter("emailId", 0),
  );
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body = buildQs(options, {
    read: "read",
    archived: "archived",
    message_category_id: toInt("message_category_id"),
    client_ids: splitCsvInt("client_ids"),
    property_ids: splitCsvInt("property_ids"),
    project_ids: splitCsvInt("project_ids"),
  });

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
