import { emailsSend } from "../../../../nodes/Propstack/v1/resources/emails/send";
import { emailsGet } from "../../../../nodes/Propstack/v1/resources/emails/get";
import { emailsUpdate } from "../../../../nodes/Propstack/v1/resources/emails/update";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("emails", () => {
  describe("send", () => {
    it("sends POST to /v1/messages with message body", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          broker_id: "5",
          to: "john@example.com, jane@example.com",
          snippet_id: "tmpl_1",
          additionalFields: {},
        },
        httpResponse: { id: 1 },
      });

      const result = await emailsSend.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/messages");
      expect(opts.body.message.broker_id).toBe("5");
      expect(opts.body.message.snippet_id).toBe("tmpl_1");
      expect(opts.body.message.to).toEqual(["john@example.com", "jane@example.com"]);
      expect(result).toHaveLength(1);
    });

    it("includes cc and bcc as arrays", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          broker_id: "5",
          to: "a@b.com",
          snippet_id: "1",
          additionalFields: {
            cc: "cc1@b.com, cc2@b.com",
            bcc: "bcc@b.com",
          },
        },
        httpResponse: { id: 2 },
      });

      await emailsSend.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.message.cc).toEqual(["cc1@b.com", "cc2@b.com"]);
      expect(opts.body.message.bcc).toEqual(["bcc@b.com"]);
    });

    it("parses client_ids and property_ids as integers", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          broker_id: "5",
          to: "a@b.com",
          snippet_id: "1",
          additionalFields: {
            client_ids: "10, 20",
            property_ids: "30",
            project_ids: "40, 50",
          },
        },
        httpResponse: { id: 3 },
      });

      await emailsSend.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.message.client_ids).toEqual([10, 20]);
      expect(opts.body.message.property_ids).toEqual([30]);
      expect(opts.body.message.project_ids).toEqual([40, 50]);
    });

    it("parses message_category_id and client_source_id as integers", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          broker_id: "5",
          to: "a@b.com",
          snippet_id: "1",
          additionalFields: {
            message_category_id: "7",
            client_source_id: "3",
          },
        },
        httpResponse: { id: 4 },
      });

      await emailsSend.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.message.message_category_id).toBe(7);
      expect(opts.body.message.client_source_id).toBe(3);
    });
  });

  describe("get", () => {
    it("sends GET to /v1/messages/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          emailId: { value: "42" },
          additionalFields: {},
        },
        httpResponse: { id: 42, subject: "Hello" },
      });

      const result = await emailsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/messages/42");
      expect(result[0].json.subject).toBe("Hello");
    });
  });


  describe("update", () => {
    it("sends PUT to /v1/messages/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          emailId: { value: "99" },
          additionalFields: {},
        },
        httpResponse: { id: 99 },
      });

      const result = await emailsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/messages/99");
      expect(result).toHaveLength(1);
    });
  });
});
