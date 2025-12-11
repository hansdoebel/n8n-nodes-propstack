import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export async function propertiesDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );

  await propstackV2Request.call(this, {
    method: "DELETE",
    url: V2.PROPERTY(propertyId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
