import { brokersGet } from "../../../../nodes/Propstack/v2/resources/brokers/get";
import { brokersGetAll } from "../../../../nodes/Propstack/v2/resources/brokers/getAll";
import { brokersCreate } from "../../../../nodes/Propstack/v2/resources/brokers/create";
import { brokersUpdate } from "../../../../nodes/Propstack/v2/resources/brokers/update";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("brokers", () => {
  describe("get", () => {
    it("sends GET to /v2/brokers/10", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { brokerId: "10" },
        httpResponse: { id: 10 },
      });

      const result = await brokersGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/brokers/10");
      expect(result).toHaveLength(1);
      expect(result[0].json.id).toBe(10);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/brokers with limit and filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 20,
          filters: { email: "test@example.com" },
        },
        httpResponse: [{ id: 1 }],
      });

      await brokersGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/brokers");
      expect(opts.qs.per).toBe(20);
      expect(opts.qs.email).toBe("test@example.com");
    });
  });

  describe("create", () => {
    it("sends POST to /v2/brokers with role, email, and additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          role: "admin",
          email: "new@example.com",
          additionalFields: { first_name: "John", last_name: "Doe" },
        },
        httpResponse: { id: 1 },
      });

      const result = await brokersCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/brokers");
      expect(opts.body.role).toBe("admin");
      expect(opts.body.email).toBe("new@example.com");
      expect(opts.body.first_name).toBe("John");
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/brokers/10 with update fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          brokerId: "10",
          additionalFields: { first_name: "Jane" },
        },
        httpResponse: { id: 10, first_name: "Jane" },
      });

      const result = await brokersUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/brokers/10");
      expect(opts.body.first_name).toBe("Jane");
      expect(result).toHaveLength(1);
    });
  });
});
