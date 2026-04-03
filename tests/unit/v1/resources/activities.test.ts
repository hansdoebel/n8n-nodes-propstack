import { describe, it, expect, mock as createMock } from "bun:test";
import { activitiesGet } from "../../../../nodes/Propstack/v1/resources/activities/get";
import { activitiesGetAll } from "../../../../nodes/Propstack/v1/resources/activities/getAll";
import { activityTypesGetAll } from "../../../../nodes/Propstack/v1/resources/activities/activityTypesGetAll";
import { reservationReasonsGetAll } from "../../../../nodes/Propstack/v1/resources/activities/reservationReasonsGetAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("activities", () => {
  describe("get", () => {
    it("sends GET to /v1/activities/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { activityId: "42" },
        httpResponse: { id: 42, title: "Phone call" },
      });

      const result = await activitiesGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/activities/42");
      expect(result[0].json.title).toBe("Phone call");
    });

    it("works with resource locator object", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { activityId: { value: "99" } },
        httpResponse: { id: 99 },
      });

      await activitiesGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.url).toBe("/v1/activities/99");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/activities with limit", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 25,
          additionalFields: {},
        },
        httpResponse: { data: [{ id: 1 }, { id: 2 }] },
      });

      const result = await activitiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/activities");
      expect(opts.qs.per).toBe(25);
      expect(opts.qs.page).toBe(1);
      expect(result).toHaveLength(2);
    });

    it("paginates when returnAll is true", async () => {
      const httpRequest = createMock()
        .mockResolvedValueOnce({ data: Array.from({ length: 100 }, (_, i) => ({ id: i + 1 })) })
        .mockResolvedValueOnce({ data: [{ id: 101 }] });

      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: true,
          limit: 20,
          additionalFields: {},
        },
        httpResponse: [],
      });
      (mock.helpers as Record<string, unknown>).httpRequest = httpRequest;

      const result = await activitiesGetAll.call(mock);

      expect(httpRequest).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(101);
    });

    it("passes filter parameters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: {
            broker_id: "5",
            creator_id: "3",
            expand: true,
            item_type: "event",
            not_completed: true,
            order: "asc",
            starts_at_from: "2025-01-01",
            starts_at_to: "2025-12-31",
          },
        },
        httpResponse: { data: [] },
      });

      await activitiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.broker_id).toBe("5");
      expect(opts.qs.creator_id).toBe("3");
      expect(opts.qs.expand).toBe(true);
      expect(opts.qs.item_type).toBe("event");
      expect(opts.qs.not_completed).toBe(true);
      expect(opts.qs.order).toBe("asc");
      expect(opts.qs.starts_at_from).toBe("2025-01-01");
      expect(opts.qs.starts_at_to).toBe("2025-12-31");
    });

    it("splits comma-separated IDs", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: {
            client_ids: "1, 2",
            property_ids: "3, 4",
            project_ids: "5",
            reason_ids: "6, 7",
          },
        },
        httpResponse: { data: [] },
      });

      await activitiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.client_ids).toEqual(["1", "2"]);
      expect(opts.qs.property_ids).toEqual(["3", "4"]);
      expect(opts.qs.project_ids).toEqual(["5"]);
      expect(opts.qs.reason_ids).toEqual(["6", "7"]);
    });
  });

  describe("activityTypesGetAll", () => {
    it("sends GET to /v1/activity_types", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: { data: [{ id: 1, name: "Call" }, { id: 2, name: "Email" }] },
      });

      const result = await activityTypesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/activity_types");
      expect(result).toHaveLength(2);
    });
  });

  describe("reservationReasonsGetAll", () => {
    it("sends GET to /v1/reservation_reasons", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: [{ id: 1, name: "Price too high" }],
      });

      const result = await reservationReasonsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/reservation_reasons");
      expect(result).toHaveLength(1);
    });
  });
});
