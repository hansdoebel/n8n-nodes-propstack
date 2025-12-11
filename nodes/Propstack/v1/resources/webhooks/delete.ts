import { IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export async function webhooksDelete(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("id", 0),
  );

  await propstackRequest.call(this, {
    method: "DELETE",
    url: API_ENDPOINTS.WEBHOOKS_DELETE(id),
  });

  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
