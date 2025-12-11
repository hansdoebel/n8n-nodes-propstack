import type { INodeProperties } from "n8n-workflow";

export const clientPropertyFieldOptions: INodeProperties[] = [
  {
    displayName: "Broker ID",
    name: "broker_id",
    type: "string",
    default: "",
  },
  {
    displayName: "Buy Reason",
    name: "buy_reason",
    type: "string",
    default: "",
  },
  {
    displayName: "Custom Fields",
    name: "custom_fields",
    type: "string",
    default: "",
    description: "Custom fields as JSON object",
  },
  {
    displayName: "Deal Pipeline ID",
    name: "deal_pipeline_id",
    type: "string",
    default: "",
  },
  {
    displayName: "Deal Stage ID",
    name: "deal_stage_id",
    type: "string",
    default: "",
  },
  {
    displayName: "Employment Status",
    name: "employment_status",
    type: "string",
    default: "",
  },
  {
    displayName: "Financing Status",
    name: "financing_status",
    type: "string",
    default: "",
  },
  {
    displayName: "Home Owner",
    name: "home_owner",
    type: "string",
    default: "",
  },
  {
    displayName: "Household Net Income Range",
    name: "household_net_income_range",
    type: "string",
    default: "",
  },
  {
    displayName: "Max Budget",
    name: "max_budget",
    type: "number",
    default: 0,
  },
  {
    displayName: "Number of Persons",
    name: "number_of_persons",
    type: "number",
    default: 0,
  },
  {
    displayName: "Own Capital",
    name: "own_capital",
    type: "number",
    default: 0,
  },
  {
    displayName: "Project ID",
    name: "project_id",
    type: "string",
    default: "",
  },
  {
    displayName: "Reservation Reason ID",
    name: "reservation_reason_id",
    type: "string",
    default: "",
  },
  {
    displayName: "Search Advance Phase",
    name: "search_advance_phase",
    type: "string",
    default: "",
  },
  {
    displayName: "Sold Price",
    name: "sold_price",
    type: "number",
    default: 0,
  },
  {
    displayName: "Start Date",
    name: "start_date",
    type: "dateTime",
    default: "",
  },
];

export const CP_DIRECT_FIELDS = [
  "broker_id", "buy_reason", "deal_pipeline_id", "deal_stage_id",
  "employment_status", "financing_status", "home_owner",
  "household_net_income_range", "max_budget", "number_of_persons",
  "own_capital", "project_id", "reservation_reason_id",
  "search_advance_phase", "sold_price", "start_date",
];

export const CP_CSV_FIELDS: string[] = [];

export const CP_JSON_FIELDS = ["custom_fields"];
