import { INodeProperties } from "n8n-workflow";

export const searchProfilesOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
      },
    },
    options: [
      {
        name: "Create",
        value: "create",
        action: "Create search profile",
        description: "Create a new search profile",
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete search profile",
        description: "Permanently remove a search profile",
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many search profiles",
        description: "Retrieve a list of search profiles",
      },
      {
        name: "Update",
        value: "update",
        action: "Update search profile",
        description: "Update an existing search profile",
      },
    ],
    default: "getAll",
  },
];

export const searchProfilesFields: INodeProperties[] = [
  {
    displayName: "Search Profile",
    name: "profileId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "The search profile to modify",
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["update", "delete"],
      },
    },
    modes: [
      {
        displayName: "From List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "searchSearchProfiles",
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
    displayName: "Client",
    name: "clientId",
    type: "resourceLocator",
    required: true,
    default: { mode: "list", value: "" },
    description: "Contact for the search profile",
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["create"],
      },
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
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    description: "Whether to return all results or only up to a given limit",
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["getAll"],
      },
    },
    default: false,
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    description: "Max number of results to return",
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["getAll"],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["create"],
      },
    },
    options: [
      { displayName: "Active", name: "active", type: "boolean", default: true, description: "Whether the search profile is active" },
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
      { displayName: "Cities", name: "cities", type: "string", default: "" },
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
      { displayName: "Floor To", name: "floorTo", type: "number", default: 0 },
      {
        displayName: "Garden",
        name: "garden",
        type: "boolean",
        default: false,
        description: "Whether the property has a garden",
      },
      { displayName: "Lift", name: "lift", type: "boolean", default: false, description: "Whether the property has a lift" },
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
      { displayName: "Note", name: "note", type: "string", default: "" },
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
      { displayName: "Price To", name: "priceTo", type: "number", default: 0 },
      {
        displayName: "Real Estate Categories",
        name: "rsCategories",
        type: "string",
        default: "",
      },
      {
        displayName: "Real Estate Types",
        name: "rsTypes",
        type: "string",
        default: "",
      },
      { displayName: "Regions", name: "regions", type: "string", default: "" },
      {
        displayName: "Rented",
        name: "rented",
        type: "boolean",
        default: false,
        description: "Whether the property is currently rented",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["update"],
      },
    },
    options: [
      { displayName: "Active", name: "active", type: "boolean", default: true, description: "Whether the search profile is active" },
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
      { displayName: "Cities", name: "cities", type: "string", default: "" },
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
      { displayName: "Floor To", name: "floorTo", type: "number", default: 0 },
      {
        displayName: "Garden",
        name: "garden",
        type: "boolean",
        default: false,
        description: "Whether the property has a garden",
      },
      { displayName: "Lift", name: "lift", type: "boolean", default: false, description: "Whether the property has a lift" },
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
      { displayName: "Note", name: "note", type: "string", default: "" },
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
      { displayName: "Price To", name: "priceTo", type: "number", default: 0 },
      {
        displayName: "Real Estate Categories",
        name: "rsCategories",
        type: "string",
        default: "",
      },
      {
        displayName: "Real Estate Types",
        name: "rsTypes",
        type: "string",
        default: "",
      },
      { displayName: "Regions", name: "regions", type: "string", default: "" },
      {
        displayName: "Rented",
        name: "rented",
        type: "boolean",
        default: false,
        description: "Whether the property is currently rented",
      },
    ],
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: {
        resource: ["searchProfiles"],
        operation: ["getAll"],
      },
    },
    options: [
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "",
        description: "Filter by contact ID",
      },
    ],
  },
];

export { searchProfilesCreate } from "./create";
export { searchProfilesDelete } from "./delete";
export { searchProfilesGetAll } from "./getAll";
export { searchProfilesUpdate } from "./update";
