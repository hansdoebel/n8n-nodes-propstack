import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeBaseDescription,
  type INodeTypeDescription,
  NodeConnectionTypes,
  NodeApiError,
  NodeOperationError,
} from "n8n-workflow";
import { API_V2_BASE_URL } from "./constants";
import {
  searchClients,
  searchClientProperties,
  searchProperties,
  searchProjects,
  searchBrokers,
  searchCustomFields,
  searchSnippets,
  searchRelationships,
} from "./listSearch";
import {
  propertiesDescription,
  propertiesGet,
  propertiesGetAll,
  propertiesCreate,
  propertiesUpdate,
  propertiesDelete,
  propertiesScroll,
  propertiesGetDeleted,
  propertiesGetOptions,
  propertiesCreateLink,
  propertiesUpdateLink,
  propertiesDeleteLink,
} from "./resources/properties";
import {
  clientsDescription,
  clientsGet,
  clientsGetAll,
  clientsCreate,
  clientsUpdate,
  clientsDelete,
  clientsScroll,
  clientsGetDeleted,
} from "./resources/clients";
import {
  clientPropertiesDescription,
  clientPropertiesGet,
  clientPropertiesGetAll,
  clientPropertiesCreate,
  clientPropertiesUpdate,
  clientPropertiesDelete,
  clientPropertiesScroll,
} from "./resources/clientProperties";
import {
  projectsDescription,
  projectsGet,
  projectsGetAll,
  projectsCreate,
  projectsUpdate,
  projectsDelete,
} from "./resources/projects";
import {
  brokersDescription,
  brokersGet,
  brokersGetAll,
  brokersCreate,
  brokersUpdate,
} from "./resources/brokers";
import {
  customFieldsDescription,
  customFieldsGet,
  customFieldsGetAll,
  customFieldsCreate,
  customFieldsUpdate,
  customFieldsDelete,
  customFieldsCreateOption,
  customFieldsDeleteOption,
} from "./resources/customFields";
import {
  snippetsDescription,
  snippetsGetAll,
  snippetsCreate,
  snippetsUpdate,
  snippetsDelete,
  snippetsAddAttachment,
} from "./resources/snippets";
import {
  relationshipsDescription,
  relationshipsGetAll,
  relationshipsCreate,
  relationshipsDelete,
} from "./resources/relationships";
import {
  historyDescription,
  historyGet,
} from "./resources/history";
import {
  activitiesDescription,
  activitiesScroll,
} from "./resources/activities";
import {
  noteAttachmentsDescription,
  noteAttachmentsCreate,
} from "./resources/noteAttachments";
import {
  referenceDescription,
  referenceGetAll,
} from "./resources/reference";

export class PropstackV2 implements INodeType {
  description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      version: 2,
      defaults: {
        name: "Propstack",
      },
      inputs: [NodeConnectionTypes.Main],
      outputs: [NodeConnectionTypes.Main],
      credentials: [
        {
          name: "propstackV2Api",
          required: true,
        },
      ],
      requestDefaults: {
        baseURL: API_V2_BASE_URL,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
      properties: [
        {
          displayName: "Resource",
          name: "resource",
          type: "options",
          noDataExpression: true,
          options: [
            { name: "Activity", value: "activities" },
            { name: "Broker", value: "brokers" },
            { name: "Client", value: "clients" },
            { name: "Client Property", value: "clientProperties" },
            { name: "Custom Field", value: "customFields" },
            { name: "History", value: "history" },
            { name: "Note Attachment", value: "noteAttachments" },
            { name: "Project", value: "projects" },
            { name: "Property", value: "properties" },
            { name: "Reference Data", value: "referenceData" },
            { name: "Relationship", value: "relationships" },
            { name: "Snippet", value: "snippets" },
          ],
          default: "clients",
        },
        ...activitiesDescription,
        ...brokersDescription,
        ...clientsDescription,
        ...clientPropertiesDescription,
        ...customFieldsDescription,
        ...historyDescription,
        ...noteAttachmentsDescription,
        ...projectsDescription,
        ...propertiesDescription,
        ...referenceDescription,
        ...relationshipsDescription,
        ...snippetsDescription,
      ],
    };
  }

  methods = {
    listSearch: {
      searchClients,
      searchClientProperties,
      searchProperties,
      searchProjects,
      searchBrokers,
      searchCustomFields,
      searchSnippets,
      searchRelationships,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    await this.getCredentials("propstackV2Api");

    const handlers: Record<
      string,
      Record<
        string,
        (this: IExecuteFunctions) => Promise<INodeExecutionData[]>
      >
    > = {
      activities: {
        scroll: activitiesScroll,
      },
      brokers: {
        create: brokersCreate,
        get: brokersGet,
        getAll: brokersGetAll,
        update: brokersUpdate,
      },
      clients: {
        create: clientsCreate,
        delete: clientsDelete,
        get: clientsGet,
        getAll: clientsGetAll,
        getDeleted: clientsGetDeleted,
        scroll: clientsScroll,
        update: clientsUpdate,
      },
      clientProperties: {
        create: clientPropertiesCreate,
        delete: clientPropertiesDelete,
        get: clientPropertiesGet,
        getAll: clientPropertiesGetAll,
        scroll: clientPropertiesScroll,
        update: clientPropertiesUpdate,
      },
      customFields: {
        create: customFieldsCreate,
        createOption: customFieldsCreateOption,
        delete: customFieldsDelete,
        deleteOption: customFieldsDeleteOption,
        get: customFieldsGet,
        getAll: customFieldsGetAll,
        update: customFieldsUpdate,
      },
      history: {
        get: historyGet,
      },
      noteAttachments: {
        create: noteAttachmentsCreate,
      },
      projects: {
        create: projectsCreate,
        delete: projectsDelete,
        get: projectsGet,
        getAll: projectsGetAll,
        update: projectsUpdate,
      },
      properties: {
        create: propertiesCreate,
        createLink: propertiesCreateLink,
        delete: propertiesDelete,
        deleteLink: propertiesDeleteLink,
        get: propertiesGet,
        getAll: propertiesGetAll,
        getDeleted: propertiesGetDeleted,
        getOptions: propertiesGetOptions,
        scroll: propertiesScroll,
        update: propertiesUpdate,
        updateLink: propertiesUpdateLink,
      },
      referenceData: {
        getAll: referenceGetAll,
      },
      relationships: {
        create: relationshipsCreate,
        delete: relationshipsDelete,
        getAll: relationshipsGetAll,
      },
      snippets: {
        addAttachment: snippetsAddAttachment,
        create: snippetsCreate,
        delete: snippetsDelete,
        getAll: snippetsGetAll,
        update: snippetsUpdate,
      },
    };

    try {
      const handler = handlers[resource]?.[operation];
      if (!handler) {
        throw new NodeOperationError(
          this.getNode(),
          `Unsupported operation "${operation}" for resource "${resource}"`,
        );
      }

      const res = await handler.call(this);
      return [res];
    } catch (error: unknown) {
      if (this.continueOnFail()) {
        const message = error instanceof Error ? error.message : `${error}`;
        return [[{ json: { error: message }, pairedItem: { item: 0 } }]];
      }
      if (error instanceof NodeApiError || error instanceof NodeOperationError) {
        throw error;
      }
      throw new NodeOperationError(this.getNode(), error instanceof Error ? error.message : `${error}`);
    }
  }
}
