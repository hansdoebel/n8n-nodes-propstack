import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForDealsUpdate = {
  operation: ["update"],
  resource: ["deals"],
};

export const dealsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDealsUpdate,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
        description: "Deal owner/broker identifier",
      },
      {
        displayName: "Category",
        name: "category",
        type: "options",
        default: "qualified",
        options: [
          { name: "Qualified", value: "qualified" },
          { name: "Unqualified", value: "unqualified" },
          { name: "Lost", value: "lost" },
        ],
        description: "Deal classification",
      },
      {
        displayName: "Client ID",
        name: "client_id",
        type: "string",
        default: "",
        description: "Contact/prospect identifier",
      },
      {
        displayName: "Date",
        name: "date",
        type: "dateTime",
        default: "",
        description: "Deal occurrence date",
      },
      {
        displayName: "Deal Pipeline ID",
        name: "deal_pipeline_id",
        type: "string",
        default: "",
        description: "Pipeline identifier",
      },
      {
        displayName: "Deal Stage ID",
        name: "deal_stage_id",
        type: "string",
        default: "",
        description: "Pipeline phase reference",
      },
      {
        displayName: "Feeling",
        name: "feeling",
        type: "number",
        default: 0,
        description: "Confidence rating (0-100)",
        typeOptions: {
          minValue: 0,
          maxValue: 100,
        },
      },
      {
        displayName: "Note",
        name: "note",
        type: "string",
        default: "",
        description: "Internal annotation",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Price",
        name: "price",
        type: "number",
        default: 0,
        description: "Projected or realized deal value",
      },
      {
        displayName: "Project ID",
        name: "project_id",
        type: "string",
        default: "",
        description: "Project identifier",
      },
      {
        displayName: "Property ID",
        name: "property_id",
        type: "string",
        default: "",
        description: "Property identifier",
      },
    ],
  },
];

function buildDealsUpdateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "client_id",
      "property_id",
      "deal_stage_id",
      "broker_id",
      "project_id",
      "deal_pipeline_id",
      "date",
      "price",
      "note",
      "feeling",
      "category",
    ];

    for (const field of fields) {
      if (
        options[field] !== undefined && options[field] !== ""
      ) {
        body[field] = options[field];
      }
    }
  }

  return body;
}

export async function dealsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const dealId = extractResourceLocatorValue(
    this.getNodeParameter("dealId", 0),
  );
  const body = buildDealsUpdateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.DEALS_UPDATE(dealId),
    body: { client_property: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default dealsUpdateDescription;
