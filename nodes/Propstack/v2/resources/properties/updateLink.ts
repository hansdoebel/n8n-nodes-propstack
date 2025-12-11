import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

const displayOptions = {
  operation: ["updateLink"],
  resource: ["properties"],
};

export const propertiesUpdateLinkDescription: INodeProperties[] = [
  {
    displayName: "Link ID",
    name: "linkId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: displayOptions },
  },
  {
    displayName: "Options",
    name: "linkUpdateFields",
    type: "collection",
    placeholder: "Add option",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Is Embedable",
        name: "is_embedable",
        type: "boolean",
        default: false,
        description: "Whether the link is embeddable",
      },
      {
        displayName: "Is Private",
        name: "is_private",
        type: "boolean",
        default: false,
        description: "Whether the link is private",
      },
      {
        displayName: "On Landing Page",
        name: "on_landing_page",
        type: "boolean",
        default: false,
        description: "Whether to display the link on the landing page",
      },
      {
        displayName: "Pinned",
        name: "pinned",
        type: "boolean",
        default: false,
        description: "Whether the link is pinned",
      },
      {
        displayName: "Position",
        name: "position",
        type: "number",
        default: 0,
      },
      {
        displayName: "Tags",
        name: "tags",
        type: "string",
        default: "",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
      },
      {
        displayName: "URL",
        name: "url",
        type: "string",
        default: "",
      },
    ],
  },
];

export async function propertiesUpdateLink(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );
  const linkId = this.getNodeParameter("linkId", 0) as string;
  const body = this.getNodeParameter("linkUpdateFields", 0, {}) as IDataObject;

  const response = await propstackV2Request.call(this, {
    method: "PUT",
    url: V2.PROPERTY_LINK(propertyId, linkId),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
