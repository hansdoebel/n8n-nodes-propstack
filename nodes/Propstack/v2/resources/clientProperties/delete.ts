import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export async function clientPropertiesDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("clientPropertyId", 0),
  );
  await propstackV2Request.call(this, {
    method: "DELETE",
    url: V2.CLIENT_PROPERTY(id),
  });
  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
