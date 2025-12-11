import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

const displayOptions = {
  operation: ["createLink"],
  resource: ["properties"],
};

export const propertiesCreateLinkDescription: INodeProperties[] = [
  {
    displayName: "Link Title",
    name: "linkTitle",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: displayOptions },
  },
  {
    displayName: "URL",
    name: "linkUrl",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: displayOptions },
  },
  {
    displayName: "Options",
    name: "linkFields",
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
    ],
  },
];

export async function propertiesCreateLink(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );
  const title = this.getNodeParameter("linkTitle", 0) as string;
  const url = this.getNodeParameter("linkUrl", 0) as string;
  const linkFields = this.getNodeParameter("linkFields", 0, {}) as IDataObject;

  const body: IDataObject = { title, url, ...linkFields };

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.PROPERTY_LINKS(propertyId),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
