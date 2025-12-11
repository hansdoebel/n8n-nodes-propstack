import { webhooksCreate } from "../../../../nodes/Propstack/v1/resources/webhooks/create";
import { webhooksDelete } from "../../../../nodes/Propstack/v1/resources/webhooks/delete";
import { webhooksGetAll } from "../../../../nodes/Propstack/v1/resources/webhooks/getAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("webhooks", () => {
  describe("create", () => {
    it("sends POST to /v1/hooks with target_url and event", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          targetUrl: "https://example.com/hook",
          event: "client.created",
        },
        httpResponse: { id: 1, event: "client.created", target_url: "https://example.com/hook" },
      });

      const result = await webhooksCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/hooks");
      expect(opts.body).toEqual({
        target_url: "https://example.com/hook",
        event: "client.created",
      });
      expect(result).toHaveLength(1);
      expect(result[0].json.event).toBe("client.created");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/hooks/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { id: { value: "5" } },
        httpResponse: { success: true },
      });

      const result = await webhooksDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/hooks/5");
      expect(result).toHaveLength(1);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/hooks", async () => {
      const mock = createMockExecuteFunctions({
        httpResponse: [
          { id: 1, event: "client.created", target_url: "https://a.com" },
          { id: 2, event: "property.updated", target_url: "https://b.com" },
        ],
      });

      const result = await webhooksGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/hooks");
      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveLength(2);
    });
  });
});
