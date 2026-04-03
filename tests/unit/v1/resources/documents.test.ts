import { documentsCreate } from "../../../../nodes/Propstack/v1/resources/documents/create";
import { documentsGet } from "../../../../nodes/Propstack/v1/resources/documents/get";
import { documentsGetAll } from "../../../../nodes/Propstack/v1/resources/documents/getAll";
import { documentsUpdate } from "../../../../nodes/Propstack/v1/resources/documents/update";
import { documentsDelete } from "../../../../nodes/Propstack/v1/resources/documents/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("documents", () => {
  describe("create", () => {
    it("sends POST to /v1/documents with base64 doc", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          doc: "data:application/pdf;base64,abc123",
          additionalFields: { title: "My Doc" },
        },
        httpResponse: { id: 1 },
      });

      const result = await documentsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/documents");
      expect(opts.body.doc).toBe("data:application/pdf;base64,abc123");
      expect(opts.body.title).toBe("My Doc");
      expect(result).toHaveLength(1);
    });

    it("splits tags into array", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          doc: "base64data",
          additionalFields: { tags: "contract, important, 2024" },
        },
        httpResponse: { id: 2 },
      });

      await documentsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.tags).toEqual(["contract", "important", "2024"]);
    });

    it("includes boolean flags", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          doc: "base64data",
          additionalFields: {
            is_floorplan: true,
            is_exposee: false,
            is_private: true,
          },
        },
        httpResponse: { id: 3 },
      });

      await documentsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.is_floorplan).toBe(true);
      expect(opts.body.is_exposee).toBe(false);
      expect(opts.body.is_private).toBe(true);
    });

    it("associates with client, property, and project", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          doc: "base64data",
          additionalFields: {
            client_id: "10",
            property_id: "20",
            project_id: "30",
          },
        },
        httpResponse: { id: 4 },
      });

      await documentsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client_id).toBe("10");
      expect(opts.body.property_id).toBe("20");
      expect(opts.body.project_id).toBe("30");
    });
  });

  describe("get", () => {
    it("sends GET to /v1/documents/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          documentId: { value: "15" },
          additionalFields: {},
        },
        httpResponse: { id: 15, name: "Report.pdf" },
      });

      const result = await documentsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/documents/15");
      expect(result[0].json.name).toBe("Report.pdf");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/documents with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 25,
          additionalFields: {},
        },
        httpResponse: { documents: [{ id: 1 }] },
      });

      const result = await documentsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/documents");
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/documents/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          documentId: { value: "18" },
          additionalFields: { title: "Updated Doc" },
        },
        httpResponse: { id: 18 },
      });

      await documentsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/documents/18");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/documents/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { documentId: { value: "22" } },
        httpResponse: { success: true },
      });

      await documentsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/documents/22");
    });
  });
});
