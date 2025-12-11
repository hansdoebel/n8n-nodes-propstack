import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export async function clientsDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );

  await propstackV2Request.call(this, {
    method: "DELETE",
    url: V2.CLIENT(clientId),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
