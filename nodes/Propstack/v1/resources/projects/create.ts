import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { propstackRequest } from "../../helpers";

const showForProjectsCreate = {
  operation: ["create"],
  resource: ["projects"],
};

export const projectsCreateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForProjectsCreate,
    },
    options: [
      {
        displayName: "Broker ID",
        name: "broker_id",
        type: "string",
        default: "",
        description: "User reference for project responsibility",
      },
      {
        displayName: "City",
        name: "city",
        type: "string",
        default: "",
      },
      {
        displayName: "Construction Year",
        name: "construction_year",
        type: "number",
        default: 0,
        description: "Year of construction",
      },
      {
        displayName: "Courtage",
        name: "courtage",
        type: "string",
        default: "",
        description: "Commission information",
      },
      {
        displayName: "Courtage Note",
        name: "courtage_note",
        type: "string",
        default: "",
        description: "Commission details",
      },
      {
        displayName: "Description",
        name: "description_note",
        type: "string",
        default: "",
        description: "Property description",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "For Rent",
        name: "for_rent",
        type: "boolean",
        default: false,
        description: "Whether this is a rental property project",
      },
      {
        displayName: "Furnishing Note",
        name: "furnishing_note",
        type: "string",
        default: "",
        description: "Furnishing description",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "House Number",
        name: "house_number",
        type: "string",
        default: "",
      },
      {
        displayName: "Latitude",
        name: "lat",
        type: "number",
        default: 0,
        description: "Geographic latitude",
      },
      {
        displayName: "Location ID",
        name: "location_id",
        type: "string",
        default: "",
        description: "Geolagen reference",
      },
      {
        displayName: "Location Note",
        name: "location_note",
        type: "string",
        default: "",
        description: "Location description",
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: "Logo URL",
        name: "logo_url",
        type: "string",
        default: "",
        description: "Logo image URL",
      },
      {
        displayName: "Longitude",
        name: "lng",
        type: "number",
        default: 0,
        description: "Geographic longitude",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        default: "",
        description: "Project identifier",
      },
      {
        displayName: "Status",
        name: "status",
        type: "options",
        default: "ACQUISITION",
        options: [
          { name: "Acquisition", value: "ACQUISITION" },
          { name: "Progress", value: "PROGRESS" },
          { name: "Sales", value: "SALES" },
          { name: "Sold", value: "SOLD" },
        ],
        description: "Project status",
      },
      {
        displayName: "Street",
        name: "street",
        type: "string",
        default: "",
        description: "Street address",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "Exposé headline",
      },
      {
        displayName: "Title Image",
        name: "title_image",
        type: "string",
        default: "",
        description: "Title image URL",
      },
      {
        displayName: "Warning Notice",
        name: "warning_notice",
        type: "string",
        default: "",
        description: "Red warning bar display text",
      },
      {
        displayName: "Zip Code",
        name: "zip_code",
        type: "string",
        default: "",
        description: "Postal code",
      },
    ],
  },
];

function buildProjectsCreateBody(this: IExecuteFunctions): IDataObject {
  const body: IDataObject = {};

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    const fields = [
      "name",
      "title",
      "status",
      "broker_id",
      "for_rent",
      "street",
      "house_number",
      "zip_code",
      "city",
      "lat",
      "lng",
      "location_id",
      "courtage",
      "courtage_note",
      "description_note",
      "location_note",
      "furnishing_note",
      "construction_year",
      "warning_notice",
      "title_image",
      "logo_url",
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

export async function projectsCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildProjectsCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.PROJECTS_CREATE,
    body: { project: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default projectsCreateDescription;
