import { noteAttachmentsCreate } from "../../../../nodes/Propstack/v2/resources/noteAttachments/create";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("noteAttachments", () => {
  describe("create", () => {
    it("sends POST to /v2/note_attachments with file data and additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          file: "base64data",
          filename: "attachment.pdf",
          additionalFields: { note_id: "42" },
        },
        httpResponse: { id: 1 },
      });

      const result = await noteAttachmentsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/note_attachments");
      expect(opts.body.file).toBe("base64data");
      expect(opts.body.filename).toBe("attachment.pdf");
      expect(opts.body.note_id).toBe("42");
      expect(result).toHaveLength(1);
    });
  });
});
