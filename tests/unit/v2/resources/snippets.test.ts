import { snippetsGetAll } from "../../../../nodes/Propstack/v2/resources/snippets/getAll";
import { snippetsCreate } from "../../../../nodes/Propstack/v2/resources/snippets/create";
import { snippetsUpdate } from "../../../../nodes/Propstack/v2/resources/snippets/update";
import { snippetsDelete } from "../../../../nodes/Propstack/v2/resources/snippets/delete";
import { snippetsAddAttachment } from "../../../../nodes/Propstack/v2/resources/snippets/addAttachment";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("snippets", () => {
  describe("getAll", () => {
    it("sends GET to /v2/snippets with limit", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
          filters: {},
        },
        httpResponse: [{ id: 1 }],
      });

      await snippetsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/snippets");
      expect(opts.qs.per).toBe(10);
    });
  });

  describe("create", () => {
    it("sends POST to /v2/snippets with name, body, and additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          snippetName: "Welcome",
          snippetBody: "<p>Hello</p>",
          additionalFields: { is_private: true, broker_ids: "1,2" },
        },
        httpResponse: { id: 1 },
      });

      const result = await snippetsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/snippets");
      expect(opts.body.name).toBe("Welcome");
      expect(opts.body.body).toBe("<p>Hello</p>");
      expect(opts.body.is_private).toBe(true);
      expect(opts.body.broker_ids).toEqual(["1", "2"]);
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/snippets/3 with update fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          snippetId: "3",
          additionalFields: { name: "Updated" },
        },
        httpResponse: { id: 3 },
      });

      const result = await snippetsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/snippets/3");
      expect(opts.body.name).toBe("Updated");
      expect(result).toHaveLength(1);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/snippets/3", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { snippetId: "3" },
        httpResponse: {},
      });

      const result = await snippetsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/snippets/3");
      expect(result).toHaveLength(1);
      expect(result[0].json.deleted).toBe(true);
    });
  });

  describe("addAttachment", () => {
    it("sends POST to /v2/snippets/3/attachments with file data", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          snippetId: "3",
          file: "base64data",
          filename: "doc.pdf",
        },
        httpResponse: { id: 1 },
      });

      const result = await snippetsAddAttachment.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/snippets/3/attachments");
      expect(opts.body.file).toBe("base64data");
      expect(opts.body.filename).toBe("doc.pdf");
      expect(result).toHaveLength(1);
    });
  });
});
