import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request, simplifyResponse } from "../../helpers";

const CLIENT_PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "client_id", "property_id", "deal_stage_id",
  "price", "status", "created_at", "updated_at",
];

export async function clientPropertiesGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("clientPropertyId", 0),
  );
  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.CLIENT_PROPERTY(id),
  });
  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], CLIENT_PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}
