import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import { extractResourceLocatorValue, propstackRequest } from "../../helpers";

const showForSearchProfilesCreate = {
  operation: ["create"],
  resource: ["searchProfiles"],
};

export const searchProfilesCreateDescription: INodeProperties[] = [
  {
    displayName: "Client ID",
    name: "clientId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
      show: showForSearchProfilesCreate,
    },
    description: "Contact ID for the search profile",
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: showForSearchProfilesCreate,
    },
    options: [
      {
        displayName: "Active",
        name: "active",
        type: "boolean",
        default: true,
        description: "Whether the search profile is active",
      },
      {
        displayName: "Balcony",
        name: "balcony",
        type: "boolean",
        default: false,
        description: "Whether the property has a balcony",
      },
      {
        displayName: "Base Rent From",
        name: "baseRentFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Base Rent To",
        name: "baseRentTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Built-in Kitchen",
        name: "builtInKitchen",
        type: "boolean",
        default: false,
        description: "Whether the property has a built-in kitchen",
      },
      {
        displayName: "Cellar",
        name: "cellar",
        type: "boolean",
        default: false,
        description: "Whether the property has a cellar",
      },
      {
        displayName: "Cities",
        name: "cities",
        type: "string",
        default: "",
        description: "Comma-separated list of cities",
      },
      {
        displayName: "Construction Year From",
        name: "constructionYearFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Construction Year To",
        name: "constructionYearTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Floor From",
        name: "floorFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Floor To",
        name: "floorTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Garden",
        name: "garden",
        type: "boolean",
        default: false,
        description: "Whether the property has a garden",
      },
      {
        displayName: "Lift",
        name: "lift",
        type: "boolean",
        default: false,
        description: "Whether the property has a lift",
      },
      {
        displayName: "Living Space From",
        name: "livingSpaceFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Living Space To",
        name: "livingSpaceTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Marketing Type",
        name: "marketingType",
        type: "options",
        default: "BUY",
        options: [
          { name: "Buy", value: "BUY" },
          { name: "Rent", value: "RENT" },
        ],
      },
      {
        displayName: "Note",
        name: "note",
        type: "string",
        default: "",
      },
      {
        displayName: "Number of Rooms From",
        name: "numberOfRoomsFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Number of Rooms To",
        name: "numberOfRoomsTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Price From",
        name: "priceFrom",
        type: "number",
        default: 0,
      },
      {
        displayName: "Price To",
        name: "priceTo",
        type: "number",
        default: 0,
      },
      {
        displayName: "Real Estate Categories",
        name: "rsCategories",
        type: "string",
        default: "",
        description: "Comma-separated list of categories",
      },
      {
        displayName: "Real Estate Types",
        name: "rsTypes",
        type: "string",
        default: "",
        description: "Comma-separated list of types",
      },
      {
        displayName: "Regions",
        name: "regions",
        type: "string",
        default: "",
        description: "Comma-separated list of regions",
      },
      {
        displayName: "Rented",
        name: "rented",
        type: "boolean",
        default: false,
        description: "Whether the property is currently rented",
      },
    ],
  },
];

function buildSearchProfilesCreateBody(this: IExecuteFunctions): IDataObject {
  const savedQuery: IDataObject = {};
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );
  savedQuery.client_id = parseInt(clientId, 10);

  const options = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  if (options) {
    if (options.active !== undefined) {
      savedQuery.active = options.active;
    }
    if (options.baseRentFrom) {
      savedQuery.base_rent_from = options.baseRentFrom;
    }
    if (options.baseRentTo) {
      savedQuery.base_rent_to = options.baseRentTo;
    }
    if (options.balcony !== undefined) {
      savedQuery.balcony = options.balcony;
    }
    if (options.builtInKitchen !== undefined) {
      savedQuery.built_in_kitchen = options.builtInKitchen;
    }
    if (options.cellar !== undefined) {
      savedQuery.cellar = options.cellar;
    }
    if (options.cities) savedQuery.cities = options.cities;
    if (options.constructionYearFrom) {
      savedQuery.construction_year_from = options.constructionYearFrom;
    }
    if (options.constructionYearTo) {
      savedQuery.construction_year_to = options.constructionYearTo;
    }
    if (options.floorFrom) {
      savedQuery.floor_from = options.floorFrom;
    }
    if (options.floorTo) {
      savedQuery.floor_to = options.floorTo;
    }
    if (options.garden !== undefined) {
      savedQuery.garden = options.garden;
    }
    if (options.livingSpaceFrom) {
      savedQuery.living_space_from = options.livingSpaceFrom;
    }
    if (options.livingSpaceTo) {
      savedQuery.living_space_to = options.livingSpaceTo;
    }
    if (options.lift !== undefined) {
      savedQuery.lift = options.lift;
    }
    if (options.marketingType) {
      savedQuery.marketing_type = options.marketingType;
    }
    if (options.note) savedQuery.note = options.note;
    if (options.numberOfRoomsFrom) {
      savedQuery.number_of_rooms_from = options.numberOfRoomsFrom;
    }
    if (options.numberOfRoomsTo) {
      savedQuery.number_of_rooms_to = options.numberOfRoomsTo;
    }
    if (options.priceFrom) {
      savedQuery.price_from = options.priceFrom;
    }
    if (options.priceTo) {
      savedQuery.price_to = options.priceTo;
    }
    if (options.rsCategories) {
      savedQuery.rs_categories = options.rsCategories;
    }
    if (options.rsTypes) {
      savedQuery.rs_types = options.rsTypes;
    }
    if (options.regions) savedQuery.regions = options.regions;
    if (options.rented !== undefined) {
      savedQuery.rented = options.rented;
    }
  }

  return { saved_query: savedQuery };
}

export async function searchProfilesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const body = buildSearchProfilesCreateBody.call(this);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.SEARCH_PROFILES_CREATE,
    body,
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}

export default searchProfilesCreateDescription;
