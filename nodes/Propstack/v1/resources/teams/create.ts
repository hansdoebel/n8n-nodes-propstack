import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForTeamsCreate = {
  operation: ["create"],
  resource: ["teams"],
};

export const teamsCreateDescription: INodeProperties[] = [
  {
    displayName: "Name",
    name: "name",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForTeamsCreate,
    },
    description: "Department name",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForTeamsCreate,
    },
    options: [
      {
        displayName: "Broker IDs",
        name: "broker_ids",
        type: "string",
        default: "",
        description: "Associated broker identifiers (comma-separated)",
      },
      {
        displayName: "Cancellation Policy Note",
        name: "cancellation_policy_note",
        type: "string",
        default: "",
        description: "Cancellation terms (HTML)",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Imprint Note",
        name: "imprint_note",
        type: "string",
        default: "",
        description: "Legal imprint (HTML)",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Logo URL",
        name: "logo_url",
        type: "string",
        default: "",
        description: "Logo image URL",
      },
      {
        displayName: "Position",
        name: "position",
        type: "number",
        default: 0,
        description: "Display order",
      },
      {
        displayName: "Privacy Note",
        name: "privacy_note",
        type: "string",
        default: "",
        description: "Privacy policy (HTML)",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Terms Note",
        name: "terms_note",
        type: "string",
        default: "",
        description: "Terms of service (HTML)",
        typeOptions: {
          rows: 4,
        },
      },
    ],
  },
];

function buildTeamsCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.name = this.getNodeParameter("name", 0) as string;

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "position",
      "logo_url",
      "cancellation_policy_note",
      "imprint_note",
      "terms_note",
      "privacy_note",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }

    if (options.broker_ids) {
      body.broker_ids = (options.broker_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
  }

  return body;
}

export async function teamsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildTeamsCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.TEAMS_CREATE,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default teamsCreateDescription;
