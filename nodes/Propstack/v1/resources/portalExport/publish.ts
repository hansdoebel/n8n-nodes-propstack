import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForPortalExportPublish = {
  operation: ["publish"],
  resource: ["portalExport"],
};

export const portalExportPublishDescription: INodeProperties[] = [
  {
    displayName: "Property IDs",
    name: "propertyIds",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForPortalExportPublish,
    },
    description: "Property identifiers (comma-separated)",
  },
  {
    displayName: "Portal IDs",
    name: "portalIds",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForPortalExportPublish,
    },
    description: "Portal identifiers (comma-separated)",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForPortalExportPublish,
    },
    options: [
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description:
          "Whether to activate the export (true) or deactivate (false)",
      },
      {
        displayName: 'Delete From ImmobilienScout24',
        name: "is24Delete",
        type: "boolean",
        default: false,
        description: "Whether to remove objects from ImmobilienScout24",
      },
    ],
  },
];

function buildPortalExportPublishBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const propertyIds = this.getNodeParameter("propertyIds", 0) as string;
  body.property_ids = propertyIds.split(",").map((id) =>
    parseInt(id.trim(), 10)
  );

  const portalIds = this.getNodeParameter("portalIds", 0) as string;
  body.portal_ids = portalIds.split(",").map((id) => parseInt(id.trim(), 10));

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    if (options.active !== undefined) {
      body.active = options.active;
    }
    if (options.is24Delete !== undefined) {
      body.is24_delete = options.is24Delete;
    }
  }

  return body;
}

export async function portalExportPublish(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildPortalExportPublishBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.PORTAL_EXPORT,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default portalExportPublishDescription;
