import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, scrollAll, simplifyResponse } from "../../helpers";

const CLIENT_PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "client_id", "property_id", "deal_stage_id",
  "price", "status", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["scroll"],
  resource: ["clientProperties"],
};

export const clientPropertiesScrollDescription: INodeProperties[] = [
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
      {
        displayName: "Deal Pipeline ID",
        name: "deal_pipeline_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Deal Stage ID",
        name: "deal_stage_id",
        type: "string",
        default: "",
      },
      {
        displayName: "Updated At From",
        name: "updated_at_from",
        type: "dateTime",
        default: "",
      },
      {
        displayName: "Updated At To",
        name: "updated_at_to",
        type: "dateTime",
        default: "",
      },
    ],
  },
];

export async function clientPropertiesScroll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, {
    deal_pipeline_id: "deal_pipeline_id",
    deal_stage_id: "deal_stage_id",
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });
  const results = await scrollAll.call(this, { url: V2.CLIENT_PROPERTIES_SCROLL, qs });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], CLIENT_PROPERTIES_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
