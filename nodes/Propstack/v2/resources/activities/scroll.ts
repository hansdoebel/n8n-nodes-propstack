import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from "n8n-workflow";
import { V2 } from "../../constants";
import { buildQs, scrollAll } from "../../helpers";

const displayOptions = { operation: ["scroll"], resource: ["activities"] };

export const activitiesScrollDescription: INodeProperties[] = [
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: displayOptions },
    options: [
      { displayName: "Created At From", name: "created_at_from", type: "dateTime", default: "" },
      { displayName: "Created At To", name: "created_at_to", type: "dateTime", default: "" },
      { displayName: "Not Completed", name: "not_completed", type: "boolean", default: false, description: "Whether to fetch incomplete items only" },
      { displayName: "Only Inquiries", name: "only_inquiries", type: "boolean", default: false, description: "Whether to return only inquiry activities" },
      { displayName: "Updated At From", name: "updated_at_from", type: "dateTime", default: "" },
      { displayName: "Updated At To", name: "updated_at_to", type: "dateTime", default: "" },
    ],
  },
];

export async function activitiesScroll(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter("filters", 0, {}) as IDataObject;
  const qs = buildQs(filters, {
    updated_at_from: "updated_at_from",
    updated_at_to: "updated_at_to",
    created_at_from: "created_at_from",
    created_at_to: "created_at_to",
    only_inquiries: "only_inquiries",
    not_completed: "not_completed",
  });
  return scrollAll.call(this, { url: V2.ACTIVITIES_SCROLL, qs });
}
