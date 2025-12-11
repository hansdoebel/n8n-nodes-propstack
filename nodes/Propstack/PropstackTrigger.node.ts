import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
  JsonObject,
} from "n8n-workflow";
import { NodeConnectionTypes } from "n8n-workflow";
import { API_ENDPOINTS } from "./v1/constants";
import { propstackRequest } from "./v1/helpers";

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
    subtitle: '={{"Propstack Trigger: " + $parameter["event"]}}',
    defaults: {
      name: "Propstack Trigger",
    },
    credentials: [
      {
        name: "propstackApi",
        required: true,
      },
    ],
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
        displayName: "Trigger On",
        name: "event",
        type: "options",
        required: true,
        default: "client_created",
        options: [
          { name: "Client Created", value: "client_created" },
          { name: "Client Property Created", value: "client_property_created" },
          { name: "Client Property Deleted", value: "client_property_deleted" },
          { name: "Client Property Updated", value: "client_property_updated" },
          { name: "Client Updated", value: "client_updated", description: "Also fires on delete" },
          { name: "Document Created", value: "document_created" },
          { name: "Document Deleted", value: "document_deleted" },
          { name: "Document Updated", value: "document_updated" },
          { name: "Project Created", value: "project_created" },
          { name: "Project Updated", value: "project_updated" },
          { name: "Property Created", value: "property_created" },
          { name: "Property Updated", value: "property_updated", description: "Also fires on delete" },
          { name: "Saved Query Created", value: "saved_query_created" },
          { name: "Saved Query Deleted", value: "saved_query_deleted" },
          { name: "Saved Query Updated", value: "saved_query_updated" },
          { name: "Task Created", value: "task_created" },
          { name: "Task Deleted", value: "task_deleted" },
          { name: "Task Updated", value: "task_updated" },
        ],
        description: "The event to listen for",
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const event = this.getNodeParameter("event") as string;
        const webhookUrl = this.getNodeWebhookUrl("default");
        const webhookData = this.getWorkflowStaticData("node");

        try {
          const hooks = (await propstackRequest.call(this, {
            method: "GET",
            url: API_ENDPOINTS.WEBHOOKS_GET_ALL,
          })) as IDataObject[];

          const existing = hooks.find(
            (h) => h.target_url === webhookUrl && h.event === event,
          );

          if (existing) {
            webhookData.webhookId = existing.id;
            return true;
          }
        } catch {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const event = this.getNodeParameter("event") as string;
        const webhookUrl = this.getNodeWebhookUrl("default");
        const webhookData = this.getWorkflowStaticData("node");

        const response = (await propstackRequest.call(this, {
          method: "POST",
          url: API_ENDPOINTS.WEBHOOKS_CREATE,
          body: {
            target_url: webhookUrl,
            event,
          },
        })) as IDataObject;

        webhookData.webhookId = response.id;
        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData("node");
        const webhookId = webhookData.webhookId as string | undefined;

        if (!webhookId) {
          return false;
        }

        try {
          await propstackRequest.call(this, {
            method: "DELETE",
            url: API_ENDPOINTS.WEBHOOKS_DELETE(String(webhookId)),
          });
        } catch (error) {
          if ((error as JsonObject).httpStatusCode !== 404) {
            throw error;
          }
        }

        delete webhookData.webhookId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const body = this.getBodyData();

    return {
      workflowData: [[{ json: body as IDataObject }]],
    };
  }
}
