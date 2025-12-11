import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildBody, propstackV2Request } from "../../helpers";
import { projectFieldOptions, PROJECT_DIRECT_FIELDS, PROJECT_CSV_FIELDS, PROJECT_JSON_FIELDS } from "./fields";

export const projectsCreateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["projects"], operation: ["create"] },
    },
    options: projectFieldOptions,
  },
];

export async function projectsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildBody.call(this, "additionalFields", PROJECT_DIRECT_FIELDS, PROJECT_CSV_FIELDS, PROJECT_JSON_FIELDS);

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.PROJECTS,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
