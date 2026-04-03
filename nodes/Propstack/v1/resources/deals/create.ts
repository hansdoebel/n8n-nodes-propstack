import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, extractResourceLocatorValue, propstackRequest } from "../../helpers";

const DEAL_BODY_MAPPING: Record<string, string> = {
  broker_id: "broker_id",
  project_id: "project_id",
  deal_pipeline_id: "deal_pipeline_id",
  date: "date",
  price: "price",
  note: "note",
  feeling: "feeling",
  category: "category",
};

const showForDealsCreate = {
  operation: ["create"],
  resource: ["deals"],
};

export const dealsCreateDescription: INodeProperties[] = [
  {
    displayName: "Client",
    name: "client_id",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "Contact/prospect for this deal",
    displayOptions: {
      show: showForDealsCreate,
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchContacts",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 12345",
      },
    ],
  },
  {
    displayName: "Property",
    name: "property_id",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "Property for this deal",
    displayOptions: {
      show: showForDealsCreate,
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchProperties",
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: "By ID",
        name: "id",
        type: "string",
        placeholder: "e.g. 12345",
      },
    ],
  },
  {
    displayName: "Deal Stage ID",
    name: "deal_stage_id",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForDealsCreate,
    },
    description: "Pipeline phase reference",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForDealsCreate,
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
        description:
          "Pipeline identifier (auto-set via deal stage if not provided)",
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
        description:
          "Project identifier (auto-populated from property if not set)",
      },
    ],
  },
];

export async function dealsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body: IDataObject = {
    client_id: extractResourceLocatorValue(this.getNodeParameter("client_id", 0)),
    property_id: extractResourceLocatorValue(this.getNodeParameter("property_id", 0)),
    deal_stage_id: this.getNodeParameter("deal_stage_id", 0) as string,
    ...buildQs(options, DEAL_BODY_MAPPING),
  };

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.DEALS_CREATE,
    body: { client_property: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default dealsCreateDescription;
