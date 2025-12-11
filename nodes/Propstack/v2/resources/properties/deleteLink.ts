import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export const propertiesDeleteLinkDescription: INodeProperties[] = [
  {
    displayName: "Link ID",
    name: "linkId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: {
        resource: ["properties"],
        operation: ["deleteLink"],
      },
    },
  },
];

export async function propertiesDeleteLink(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );
  const linkId = this.getNodeParameter("linkId", 0) as string;

  await propstackV2Request.call(this, {
    method: "DELETE",
    url: V2.PROPERTY_LINK(propertyId, linkId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
