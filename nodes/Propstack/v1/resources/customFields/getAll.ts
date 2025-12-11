import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForCustomFieldsGetAll = {
  operation: ["getAll"],
  resource: ["customFields"],
};

export const customFieldsGetAllDescription: INodeProperties[] = [
  {
    displayName: "Entity",
    name: "entity",
    type: "options",
    required: true,
    default: "for_properties",
    displayOptions: {
      show: showForCustomFieldsGetAll,
    },
    options: [
      {
        name: "Brokers",
        value: "for_brokers",
      },
      {
        name: "Clients",
        value: "for_clients",
      },
      {
        name: "Deals",
        value: "for_deals",
      },
      {
        name: "Projects",
        value: "for_projects",
      },
      {
        name: "Properties",
        value: "for_properties",
      },
      {
        name: "Tasks",
        value: "for_tasks",
      },
    ],
    description: "Entity type to retrieve custom field groups for",
  },
];

export async function customFieldsGetAll(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const entity = this.getNodeParameter("entity", 0) as string;

  const qs: IDataObject = {
    entity,
  };

  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.CUSTOM_FIELDS_GET_ALL,
    qs,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default customFieldsGetAllDescription;
