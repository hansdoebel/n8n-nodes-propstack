import type {
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { propstackV2Request } from "../../helpers";

const REFERENCE_URLS: Record<string, string> = {
  propertyStatuses: V2.PROPERTY_STATUSES,
  publishings: V2.PUBLISHINGS,
  portals: V2.PORTALS,
  clientStatuses: V2.CLIENT_STATUSES,
  clientSources: V2.CLIENT_SOURCES,
  snippetCategories: V2.SNIPPET_CATEGORIES,
  groups: V2.GROUPS,
  folders: V2.FOLDERS,
  comments: V2.COMMENTS,
  messageTrackings: V2.MESSAGE_TRACKINGS,
  recipes: V2.RECIPES,
  rights: V2.RIGHTS,
};

export async function referenceGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const referenceType = this.getNodeParameter("referenceType", 0) as string;
  const url = REFERENCE_URLS[referenceType];

  const response = await propstackV2Request.call(this, {
    method: "GET",
    url,
  });

  const data = Array.isArray(response) ? response : [response];
  return this.helpers.returnJsonArray(data);
}
