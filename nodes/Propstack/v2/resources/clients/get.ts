import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request, simplifyResponse } from "../../helpers";

const CLIENTS_SIMPLIFIED_FIELDS = [
  "id", "first_name", "last_name", "company", "emails",
  "phone", "client_status_id", "broker_id", "created_at", "updated_at",
];

export async function clientsGet(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );

  const response = await propstackV2Request.call(this, {
    method: "GET",
    url: V2.CLIENT(clientId),
  });

  const data = Array.isArray(response) ? response : [response];
  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  return this.helpers.returnJsonArray(
    simplify ? simplifyResponse(data as IDataObject[], CLIENTS_SIMPLIFIED_FIELDS) : data,
  );
}
