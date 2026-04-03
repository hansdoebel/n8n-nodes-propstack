import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { buildQs, extractResourceLocatorValue, propstackRequest, toInt } from "../../helpers";

const showForProjectsUpdate = {
  operation: ["update"],
  resource: ["projects"],
};

const PROJECT_BODY_MAPPING: Record<string, string | ((v: unknown) => [string, unknown])> = {
  name: "name",
  title: "title",
  status: "status",
  broker_id: toInt("broker_id"),
  for_rent: "for_rent",
  street: "street",
  house_number: "house_number",
  zip_code: "zip_code",
  city: "city",
  lat: "lat",
  lng: "lng",
  location_id: toInt("location_id"),
  courtage: "courtage",
  courtage_note: "courtage_note",
  description_note: "description_note",
  location_note: "location_note",
  furnishing_note: "furnishing_note",
  construction_year: "construction_year",
  warning_notice: "warning_notice",
  title_image: "title_image",
  logo_url: "logo_url",
  note: "note",
};

export const projectsUpdateDescription: INodeProperties[] = [
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForProjectsUpdate,
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
        displayName: "Note",
        name: "note",
        type: "string",
        default: "",
        description: "Project note",
        typeOptions: {
          rows: 4,
        },
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
        description: "Expose headline",
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

export async function projectsUpdate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const projectId = extractResourceLocatorValue(
    this.getNodeParameter("projectId", 0),
  );
  const options = this.getNodeParameter("additionalFields", 0) as IDataObject;
  const body = buildQs(options, PROJECT_BODY_MAPPING);

  const response = await propstackRequest.call(this, {
    method: "PUT",
    url: API_ENDPOINTS.PROJECTS_UPDATE(projectId),
    body: { project: body },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
