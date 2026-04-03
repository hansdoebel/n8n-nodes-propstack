import { customFieldsGetAll } from "../../../../nodes/Propstack/v1/resources/customFields/getAll";
import { dealPipelinesGet } from "../../../../nodes/Propstack/v1/resources/dealPipelines/get";
import { dealPipelinesGetAll } from "../../../../nodes/Propstack/v1/resources/dealPipelines/getAll";
import { brokersGetAll } from "../../../../nodes/Propstack/v1/resources/brokers/getAll";
import { locationsGetAll } from "../../../../nodes/Propstack/v1/resources/locations/getAll";
import { eventsGetAll } from "../../../../nodes/Propstack/v1/resources/events/getAll";
import { notesGetAll } from "../../../../nodes/Propstack/v1/resources/notes/getAll";
import { portalExportPublish } from "../../../../nodes/Propstack/v1/resources/portalExport/publish";
import { searchProfilesCreate } from "../../../../nodes/Propstack/v1/resources/searchProfiles/create";
import { searchProfilesDelete } from "../../../../nodes/Propstack/v1/resources/searchProfiles/delete";
import { searchProfilesGetAll } from "../../../../nodes/Propstack/v1/resources/searchProfiles/getAll";
import { searchProfilesUpdate } from "../../../../nodes/Propstack/v1/resources/searchProfiles/update";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("customFields", () => {
  describe("getAll", () => {
    it("sends GET to /v1/custom_field_groups with entity", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { entity: "for_properties" },
        httpResponse: [{ id: 1, name: "Property Details" }],
      });

      const result = await customFieldsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/custom_field_groups");
      expect(opts.qs.entity).toBe("for_properties");
      expect(result).toHaveLength(1);
    });

    it("works with different entity types", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { entity: "for_clients" },
        httpResponse: [],
      });

      await customFieldsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.entity).toBe("for_clients");
    });
  });
});

describe("dealPipelines", () => {
  describe("get", () => {
    it("sends GET to /v1/deal_pipelines/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          pipelineId: { value: "3" },
        },
        httpResponse: { id: 3, name: "Sales Pipeline" },
      });

      const result = await dealPipelinesGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/deal_pipelines/3");
      expect(result[0].json.name).toBe("Sales Pipeline");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/deal_pipelines", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: [
          { id: 1, name: "Sales" },
          { id: 2, name: "Rental" },
        ],
      });

      const result = await dealPipelinesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/deal_pipelines");
      expect(result).toHaveLength(2);
    });
  });
});

describe("brokers", () => {
  describe("getAll", () => {
    it("sends GET to /v1/brokers", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: [{ id: 1, name: "John Broker" }],
      });

      const result = await brokersGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/brokers");
      expect(result).toHaveLength(1);
    });
  });
});

describe("locations", () => {
  describe("getAll", () => {
    it("sends GET to /v1/locations", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: [{ id: 1, name: "Berlin" }],
      });

      const result = await locationsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/locations");
      expect(result).toHaveLength(1);
    });
  });
});

describe("events", () => {
  describe("getAll", () => {
    it("sends GET to /v1/events with filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 20,
          additionalFields: {},
        },
        httpResponse: { events: [{ id: 1 }] },
      });

      const result = await eventsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/events");
      expect(result).toHaveLength(1);
    });
  });
});

describe("notes", () => {
  describe("getAll", () => {
    it("sends GET to /v1/notes with filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 30,
          additionalFields: {},
        },
        httpResponse: [{ id: 1, body: "A note" }],
      });

      const result = await notesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/notes");
      expect(result).toHaveLength(1);
    });
  });
});

describe("portalExport", () => {
  describe("publish", () => {
    it("sends POST to /v1/portals/publish with property and portal IDs", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyIds: "10, 20, 30",
          portalIds: "1, 2",
          additionalFields: {},
        },
        httpResponse: { success: true },
      });

      const result = await portalExportPublish.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/portals/publish");
      expect(opts.body.property_ids).toEqual([10, 20, 30]);
      expect(opts.body.portal_ids).toEqual([1, 2]);
      expect(result).toHaveLength(1);
    });

    it("includes active and is24Delete flags", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyIds: "1",
          portalIds: "2",
          additionalFields: {
            active: true,
            is24Delete: true,
          },
        },
        httpResponse: { success: true },
      });

      await portalExportPublish.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.active).toBe(true);
      expect(opts.body.is24_delete).toBe(true);
    });

    it("handles active=false", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyIds: "1",
          portalIds: "2",
          additionalFields: { active: false },
        },
        httpResponse: { success: true },
      });

      await portalExportPublish.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.active).toBe(false);
    });
  });
});

describe("searchProfiles", () => {
  describe("create", () => {
    it("sends POST to /v1/saved_queries with client_id", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          clientId: "100",
          additionalFields: {},
        },
        httpResponse: { id: 1, client_id: 100 },
      });

      const result = await searchProfilesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/saved_queries");
      expect(opts.body.saved_query.client_id).toBe(100);
      expect(result).toHaveLength(1);
    });

    it("includes search criteria fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          clientId: "100",
          additionalFields: {
            priceFrom: 100000,
            priceTo: 500000,
            livingSpaceFrom: 50,
            livingSpaceTo: 120,
            numberOfRoomsFrom: 2,
            numberOfRoomsTo: 5,
            marketingType: "BUY",
            balcony: true,
            garden: false,
            lift: true,
            cellar: true,
            builtInKitchen: false,
          },
        },
        httpResponse: { id: 2 },
      });

      await searchProfilesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      const sq = opts.body.saved_query;
      expect(sq.price_from).toBe(100000);
      expect(sq.price_to).toBe(500000);
      expect(sq.living_space_from).toBe(50);
      expect(sq.living_space_to).toBe(120);
      expect(sq.number_of_rooms_from).toBe(2);
      expect(sq.number_of_rooms_to).toBe(5);
      expect(sq.marketing_type).toBe("BUY");
      expect(sq.balcony).toBe(true);
      expect(sq.garden).toBe(false);
      expect(sq.lift).toBe(true);
      expect(sq.cellar).toBe(true);
      expect(sq.built_in_kitchen).toBe(false);
    });

    it("includes location and construction fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          clientId: "100",
          additionalFields: {
            cities: "Berlin, Munich",
            regions: "Bavaria",
            constructionYearFrom: 2000,
            constructionYearTo: 2025,
            floorFrom: 1,
            floorTo: 5,
            baseRentFrom: 500,
            baseRentTo: 1500,
            active: true,
            note: "Test search",
            rented: false,
          },
        },
        httpResponse: { id: 3 },
      });

      await searchProfilesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      const sq = opts.body.saved_query;
      expect(sq.cities).toBe("Berlin, Munich");
      expect(sq.regions).toBe("Bavaria");
      expect(sq.construction_year_from).toBe(2000);
      expect(sq.construction_year_to).toBe(2025);
      expect(sq.floor_from).toBe(1);
      expect(sq.floor_to).toBe(5);
      expect(sq.base_rent_from).toBe(500);
      expect(sq.base_rent_to).toBe(1500);
      expect(sq.active).toBe(true);
      expect(sq.note).toBe("Test search");
      expect(sq.rented).toBe(false);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/saved_queries", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }],
      });

      const result = await searchProfilesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/saved_queries");
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/saved_queries/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          profileId: { value: "5" },
          additionalFields: { priceFrom: 200000 },
        },
        httpResponse: { id: 5 },
      });

      const result = await searchProfilesUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/saved_queries/5");
      expect(result).toHaveLength(1);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/saved_queries/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { profileId: "7" },
        httpResponse: { success: true },
      });

      await searchProfilesDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/saved_queries/7");
    });
  });
});
