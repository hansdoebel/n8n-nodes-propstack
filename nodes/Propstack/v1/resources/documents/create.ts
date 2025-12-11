import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForDocumentsCreate = {
  operation: ["create"],
  resource: ["documents"],
};

export const documentsCreateDescription: INodeProperties[] = [
  {
    displayName: "Document (Base64)",
    name: "doc",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDocumentsCreate,
    },
    description: "Base64-encoded file content",
    typeOptions: {
      rows: 4,
    },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDocumentsCreate,
    },
    options: [
      {
        displayName: "Client ID",
        name: "client_id",
        type: "string",
        default: "",
        description: "Associate with contact",
      },
      {
        displayName: "Is Exposee",
        name: "is_exposee",
        type: "boolean",
        default: false,
        description: "Whether to use as PDF brochure",
      },
      {
        displayName: "Is Floorplan",
        name: "is_floorplan",
        type: "boolean",
        default: false,
        description: "Whether to designate as floor plan",
      },
      {
        displayName: "Is Private",
        name: "is_private",
        type: "boolean",
        default: false,
        description: "Whether the document is private",
      },
      {
        displayName: "On Landing Page",
        name: "on_landing_page",
        type: "boolean",
        default: false,
        description: "Whether to display on landing page",
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
        description: "Associate with project",
      },
      {
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
        description: "Associate with property",
      },
      {
        displayName: "Tags",
        name: "tags",
        type: "string",
        default: "",
        description: "Document tags (comma-separated, new tags auto-created)",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "Custom document name",
      },
    ],
  },
];

function buildDocumentsCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  body.doc = this.getNodeParameter("doc", 0) as string;

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "title",
      "client_id",
      "property_id",
      "project_id",
      "on_landing_page",
      "is_floorplan",
      "is_exposee",
      "is_private",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }

    if (options.tags) {
      body.tags = (options.tags as string)
        .split(",")
        .map((tag) => tag.trim());
    }
  }

  return body;
}

export async function documentsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildDocumentsCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.DOCUMENTS_CREATE,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default documentsCreateDescription;
