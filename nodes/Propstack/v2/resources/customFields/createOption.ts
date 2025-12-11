import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export const customFieldsCreateOptionDescription: INodeProperties[] = [
  {
    displayName: "Option Name",
    name: "optionName",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["customFields"], operation: ["createOption"] } },
  },
];

export async function customFieldsCreateOption(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const fieldId = extractResourceLocatorValue(this.getNodeParameter("customFieldId", 0));
  const name = this.getNodeParameter("optionName", 0) as string;

  const response = await propstackV2Request.call(this, {
    method: "POST",
    url: V2.CUSTOM_FIELD_OPTIONS(fieldId),
    body: { name },
  });
  return this.helpers.returnJsonArray(Array.isArray(response) ? response : [response]);
}
