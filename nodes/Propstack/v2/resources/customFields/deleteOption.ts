import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { extractResourceLocatorValue, propstackV2Request } from "../../helpers";

export const customFieldsDeleteOptionDescription: INodeProperties[] = [
  {
    displayName: "Option ID",
    name: "customOptionId",
    type: "string",
    required: true,
    default: "",
    displayOptions: { show: { resource: ["customFields"], operation: ["deleteOption"] } },
  },
];

export async function customFieldsDeleteOption(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const fieldId = extractResourceLocatorValue(this.getNodeParameter("customFieldId", 0));
  const optionId = this.getNodeParameter("customOptionId", 0) as string;
  await propstackV2Request.call(this, { method: "DELETE", url: V2.CUSTOM_FIELD_OPTION(fieldId, optionId) });
  return [{ json: { deleted: true }, pairedItem: { item: 0 } }];
}
