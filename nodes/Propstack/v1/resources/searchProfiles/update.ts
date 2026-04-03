import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import {
  buildQs,
  extractResourceLocatorValue,
  propstackRequest,
} from "../../helpers";
import { SEARCH_PROFILE_FIELD_MAPPING } from "./create";

export async function searchProfilesUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const profileId = extractResourceLocatorValue(
    this.getNodeParameter("profileId", 0),
  );
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const body = buildQs(additionalFields, SEARCH_PROFILE_FIELD_MAPPING);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.SEARCH_PROFILES_UPDATE(profileId),
    body: { saved_query: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
