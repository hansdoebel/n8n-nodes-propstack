import type { INodeProperties } from "n8n-workflow";
import { activitiesScrollDescription, activitiesScroll } from "./scroll";

export { activitiesScroll };

export const activitiesDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["activities"] } },
    options: [
      { name: "Scroll", value: "scroll", action: "Scroll all activities", description: "Retrieve all activities using scroll pagination" },
    ],
    default: "scroll",
  },
  ...activitiesScrollDescription,
];
