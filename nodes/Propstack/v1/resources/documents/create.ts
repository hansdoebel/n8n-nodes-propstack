import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest, splitCsv } from "../../helpers";

const DOC_BODY_MAPPING: Record<string, string> = {
  title: "title",
  client_id: "client_id",
  property_id: "property_id",
  project_id: "project_id",
  on_landing_page: "on_landing_page",
  is_floorplan: "is_floorplan",
  is_exposee: "is_exposee",
  is_private: "is_private",
};

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

export async function documentsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body: IDataObject = {
    doc: this.getNodeParameter("doc", 0) as string,
    ...buildQs(options, {
      ...DOC_BODY_MAPPING,
      tags: splitCsv("tags"),
    }),
  };

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
