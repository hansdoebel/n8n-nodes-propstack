import { createHmac } from "crypto";
import type {
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";

export class PropstackTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Propstack Trigger",
    name: "propstackTrigger",
    icon: {
      light: "file:../../icons/propstack.svg",
      dark: "file:../../icons/propstack.dark.svg",
    },
    group: ["trigger"],
    version: 1,
    description: "Starts a workflow when a Propstack event occurs",
    defaults: {
      name: "Propstack Trigger",
    },
    credentials: [],
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    webhooks: [
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: "webhook",
      },
    ],
    properties: [
      {
        displayName: "Verify Signature",
        name: "verifySignature",
        type: "boolean",
        default: false,
        description:
          "Whether to verify the HMAC signature sent in the X-Propstack-Signature header",
      },
      {
        displayName: "Secret Key",
        name: "secretKey",
        type: "string",
        typeOptions: { password: true },
        default: "",
        placeholder: "e.g. my-webhook-secret",
        displayOptions: {
          show: {
            verifySignature: [true],
          },
        },
        description:
          "The secret key configured in the Propstack webhook settings",
      },
      {
        displayName: "Required Headers",
        name: "requiredHeaders",
        type: "fixedCollection",
        typeOptions: { multipleValues: true },
        placeholder: "Add Header",
        default: {},
        options: [
          {
            name: "entries",
            displayName: "Entries",
            values: [
              {
                displayName: "Header Name",
                name: "name",
                type: "string",
                default: "",
                placeholder: "e.g. X-Custom-Header",
              },
              {
                displayName: "Header Value",
                name: "value",
                type: "string",
                default: "",
                placeholder: "e.g. my-secret-value",
              },
            ],
          },
        ],
      },
    ],
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const verifySignature = this.getNodeParameter("verifySignature") as boolean;

    if (verifySignature) {
      const secretKey = this.getNodeParameter("secretKey") as string;
      const signature = req.headers["x-propstack-signature"] as
        | string
        | undefined;
      const rawBody = JSON.stringify(req.body);

      const expectedSignature = createHmac("sha256", secretKey)
        .update(rawBody, "utf8")
        .digest("hex");

      if (!signature || signature !== expectedSignature) {
        const resp = this.getResponseObject();
        resp.writeHead(403);
        resp.end("Forbidden");
        return { noWebhookResponse: true };
      }
    }

    const { entries = [] } = this.getNodeParameter("requiredHeaders", {}) as {
      entries?: Array<{ name: string; value: string }>;
    };

    for (const entry of entries) {
      const incoming = req.headers[entry.name.toLowerCase()] as
        | string
        | undefined;
      if (!incoming || incoming !== entry.value) {
        const resp = this.getResponseObject();
        resp.writeHead(403);
        resp.end("Forbidden");
        return { noWebhookResponse: true };
      }
    }

    const body = this.getBodyData();

    return {
      workflowData: [[{ json: body as IDataObject }]],
    };
  }
}
