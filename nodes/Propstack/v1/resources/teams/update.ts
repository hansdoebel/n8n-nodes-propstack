import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

export const teamsUpdateDescription: INodeProperties[] = [];

function buildTeamsUpdateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "name",
      "position",
      "logo_url",
      "cancellation_policy_note",
      "imprint_note",
      "terms_note",
      "privacy_note",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }

    if (options.broker_ids) {
      body.broker_ids = (options.broker_ids as string)
        .split(",")
        .map((id) => parseInt(id.trim(), 10));
    }
  }

  return body;
}

export async function teamsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const teamId = extractResourceLocatorValue(
    this.getNodeParameter("teamId", 0),
  );
  const body = buildTeamsUpdateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.TEAMS_UPDATE(teamId),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default teamsUpdateDescription;
