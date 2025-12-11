import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, extractResourceLocatorValue, propstackV2Request } from "../../helpers";
import { projectFieldOptions, PROJECT_DIRECT_FIELDS, PROJECT_CSV_FIELDS, PROJECT_JSON_FIELDS } from "./fields";

export const projectsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["projects"], operation: ["update"] },
    },
    options: projectFieldOptions,
  },
];

export async function projectsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const id = extractResourceLocatorValue(
    this.getNodeParameter("projectId", 0),
  );
  const body = buildBody.call(this, "additionalFields", PROJECT_DIRECT_FIELDS, PROJECT_CSV_FIELDS, PROJECT_JSON_FIELDS);

  const response = await propstackV2Request.call(this, {
    method: "PUT",
    url: V2.PROJECT(id),
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
