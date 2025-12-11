import type { INodeProperties } from "n8n-workflow";
import { emailsSend, emailsSendDescription } from "./send";
import { emailsGet, emailsGetDescription } from "./get";
import { emailsGetAll, emailsGetAllDescription } from "./getAll";
import { emailsUpdate, emailsUpdateDescription } from "./update";

export { emailsGet, emailsGetAll, emailsSend, emailsUpdate };

const emailIdField: INodeProperties = {
  displayName: "Email",
  name: "emailId",
  type: "resourceLocator",
  required: true,
  default: { mode: "list", value: "" },
  description: "The email to operate on",
  displayOptions: {
    show: {
      resource: ["emails"],
      operation: ["get", "update"],
    },
  },
  modes: [
    {
      displayName: "From List",
      name: "list",
      type: "list",
      typeOptions: {
        searchListMethod: "searchEmails",
        searchable: true,
        searchFilterRequired: false,
      },
    },
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
        name: "Get Many",
        value: "getAll",
        action: "Get many emails",
        description: "Retrieve a list of emails",
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
  ...emailsGetDescription,
  ...emailsGetAllDescription,
  ...emailsSendDescription,
  ...emailsUpdateDescription,
];
