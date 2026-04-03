import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
} from "n8n-workflow";

import { API_ENDPOINTS } from "../../constants";
import {
  buildQs,
  extractResourceLocatorValue,
  propstackRequest,
  splitCsv,
} from "../../helpers";

const SEARCH_PROFILE_FIELD_MAPPING: Record<string, string | ((v: unknown) => [string, unknown] | undefined)> = {
  priceFrom: "price_from",
  priceTo: "price_to",
  baseRentFrom: "base_rent_from",
  baseRentTo: "base_rent_to",
  livingSpaceFrom: "living_space_from",
  livingSpaceTo: "living_space_to",
  numberOfRoomsFrom: "number_of_rooms_from",
  numberOfRoomsTo: "number_of_rooms_to",
  numberOfBedroomsFrom: "number_of_bedrooms_from",
  numberOfBedroomsTo: "number_of_bedrooms_to",
  constructionYearFrom: "construction_year_from",
  constructionYearTo: "construction_year_to",
  floorFrom: "floor_from",
  floorTo: "floor_to",
  plotAreaFrom: "plot_area_from",
  plotAreaTo: "plot_area_to",
  marketingType: "marketing_type",
  builtInKitchen: "built_in_kitchen",
  rsTypes: splitCsv("rs_types"),
  rsCategories: splitCsv("rs_categories"),
  cities: "cities",
  regions: "regions",
  note: "note",
  active: "active",
  balcony: "balcony",
  garden: "garden",
  lift: "lift",
  cellar: "cellar",
  rented: "rented",
  lat: "lat",
  lng: "lng",
  radius: "radius",
  groupIds: splitCsv("group_ids"),
};

export { SEARCH_PROFILE_FIELD_MAPPING };

export async function searchProfilesCreate(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const clientId = extractResourceLocatorValue(
    this.getNodeParameter("clientId", 0),
  );
  const additionalFields = this.getNodeParameter(
    "additionalFields",
    0,
  ) as IDataObject;

  const body = buildQs(additionalFields, SEARCH_PROFILE_FIELD_MAPPING);

  const response = await propstackRequest.call(this, {
    method: "POST",
    url: API_ENDPOINTS.SEARCH_PROFILES_CREATE,
    body: { saved_query: { client_id: parseInt(clientId, 10), ...body } },
  });

  return this.helpers.returnJsonArray(
    Array.isArray(response) ? response : [response],
  );
}
