import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, scrollAll, simplifyResponse } from "../../helpers";

const PROPERTIES_SIMPLIFIED_FIELDS = [
  "id", "title", "rs_type", "marketing_type", "price",
  "living_space", "number_of_rooms", "street", "city",
  "zip_code", "status", "created_at", "updated_at",
];

const displayOptions = {
  operation: ["scroll"],
  resource: ["properties"],
};

export const propertiesScrollDescription: INodeProperties[] = [
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
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

export async function propertiesScroll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;

  const qs = buildQs(filters, {
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
  });

  const results = await scrollAll.call(this, { url: V2.PROPERTIES_SCROLL, qs });

  const simplify = this.getNodeParameter("simplify", 0, true) as boolean;
  if (simplify) {
    return results.map((item) => ({
      ...item,
      json: simplifyResponse([item.json as IDataObject], PROPERTIES_SIMPLIFIED_FIELDS)[0],
    }));
  }
  return results;
}
