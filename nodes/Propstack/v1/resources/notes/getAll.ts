import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, propstackRequest, toInt } from "../../helpers";

export async function notesGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const qs = buildQs(options, {
    tag: toInt("tag"),
    broker: toInt("broker"),
    noteType: toInt("note_type"),
    client: toInt("client"),
    property: toInt("property"),
    project: toInt("project"),
  });

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.NOTES_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
