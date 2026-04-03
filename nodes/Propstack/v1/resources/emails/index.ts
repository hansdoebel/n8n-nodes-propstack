import type { INodeProperties } from "n8n-workflow";
import { emailsSend, emailsSendDescription } from "./send";
import { emailsGet } from "./get";
import { emailsUpdate, emailsUpdateDescription } from "./update";

export { emailsGet, emailsSend, emailsUpdate };

const emailIdField: INodeProperties = {
  displayName: "Email",
  name: "emailId",
  type: "resourceLocator",
  required: true,
  default: { mode: "id", value: "" },
  description: "The email to operate on",
  displayOptions: {
    show: {
      resource: ["emails"],
      operation: ["get", "update"],
    },
  },
  modes: [
    {
      displayName: "By ID",
      name: "id",
      type: "string",
      placeholder: "e.g. 12345",
    },
  ],
};

export const emailsDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["emails"],
      },
    },
    options: [
      {
        name: "Get",
        value: "get",
        action: "Get email",
        description: "Retrieve an email",
      },
      {
        name: "Send",
        value: "send",
        action: "Send email",
        description: "Send an email",
      },
      {
        name: "Update",
        value: "update",
        action: "Update email",
        description: "Update an existing email",
      },
    ],
    default: "send",
  },
  emailIdField,
  ...emailsSendDescription,
  ...emailsUpdateDescription,
];
