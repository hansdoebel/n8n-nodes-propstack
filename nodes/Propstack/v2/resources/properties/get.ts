import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "rs_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "zip_code", "status", "created_at", "updated_at",
];

export async function propertiesGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const propertyId = extractResourceLocatorValue(
    this.getNodeParameter("propertyId", 0),
  );

  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.PROPERTY(propertyId),
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], PROPERTIES_SIMPLIFIED_FIELDS) : data,
  );
}
