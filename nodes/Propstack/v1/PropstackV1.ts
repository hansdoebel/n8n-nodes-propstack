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
import { API_ENDPOINTS } from "./constants";
import {
  searchActivities,
  searchContacts,
  searchDeals,
  searchDealPipelines,
  searchDocuments,
  searchEmails,
  searchParentFeatures,
  searchProjects,
  searchProperties,
  searchSearchProfiles,
  searchTasks,
  searchTeams,
  searchWebhooks,
} from "./listSearch";
import {
  contactsCreate,
  contactsDelete,
  contactsDescription,
  contactsGet,
  contactsGetAll,
  contactsUpdate,
} from "./resources/contacts";
import {
  propertiesCreate,
  propertiesDelete,
  propertiesDescription,
  propertiesGet,
  propertiesGetAll,
  propertiesUpdate,
} from "./resources/properties";
import {
  dealsCreate,
  dealsDelete,
  dealsDescription,
  dealsGet,
  dealsGetAll,
  dealsUpdate,
} from "./resources/deals";
import {
  emailsDescription,
  emailsGet,
  emailsGetAll,
  emailsSend,
  emailsUpdate,
} from "./resources/emails";
import {
  documentsCreate,
  documentsDelete,
  documentsDescription,
  documentsGet,
  documentsGetAll,
  documentsUpdate,
} from "./resources/documents";
import {
  projectsCreate,
  projectsDescription,
  projectsGet,
  projectsGetAll,
  projectsUpdate,
} from "./resources/projects";
import {
  tasksCreate,
  tasksDelete,
  tasksFields,
  tasksGet,
  tasksGetAll,
  tasksOperations,
  tasksUpdate,
} from "./resources/tasks";
import {
  teamsCreate,
  teamsDelete,
  teamsFields,
  teamsGet,
  teamsGetAll,
  teamsOperations,
  teamsUpdate,
} from "./resources/teams";
import {
  activitiesFields,
  activitiesGet,
  activitiesGetAll,
  activitiesOperations,
  activityTypesGetAll,
  reservationReasonsGetAll,
} from "./resources/activities";
import {
  customFieldsFields,
  customFieldsGetAll,
  customFieldsOperations,
} from "./resources/customFields";
import {
  dealPipelinesFields,
  dealPipelinesGet,
  dealPipelinesGetAll,
  dealPipelinesOperations,
} from "./resources/dealPipelines";
import {
  locationsFields,
  locationsGetAll,
  locationsOperations,
} from "./resources/locations";
import {
  featuresCreate,
  featuresFields,
  featuresGetAll,
  featuresOperations,
  featuresParentGetAll,
} from "./resources/features";
import {
  brokersFields,
  brokersGetAll,
  brokersOperations,
} from "./resources/brokers";
import {
  portalExportFields,
  portalExportOperations,
  portalExportPublish,
} from "./resources/portalExport";
import {
  searchProfilesCreate,
  searchProfilesDelete,
  searchProfilesFields,
  searchProfilesGetAll,
  searchProfilesOperations,
  searchProfilesUpdate,
} from "./resources/searchProfiles";
import {
  eventsFields,
  eventsGetAll,
  eventsOperations,
} from "./resources/events";
import { notesFields, notesGetAll, notesOperations } from "./resources/notes";
import {
  webhooksCreate,
  webhooksDelete,
  webhooksFields,
  webhooksGetAll,
  webhooksOperations,
} from "./resources/webhooks";

export class PropstackV1 implements INodeType {
  description: INodeTypeDescription;

  constructor(baseDescription: INodeTypeBaseDescription) {
    this.description = {
      ...baseDescription,
      version: 1,
      defaults: {
        name: "Propstack",
      },
      inputs: [NodeConnectionTypes.Main],
      outputs: [NodeConnectionTypes.Main],
      credentials: [
        {
          name: "propstackApi",
          required: true,
        },
      ],
      requestDefaults: {
        baseURL: API_ENDPOINTS.BASE_URL,
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
            {
              name: "Activity",
              value: "activities",
            },
            {
              name: "Broker",
              value: "brokers",
            },
            {
              name: "Contact",
              value: "contacts",
            },
            {
              name: "Custom Field",
              value: "customFields",
            },
            {
              name: "Deal",
              value: "deals",
            },
            {
              name: "Deal Pipeline",
              value: "dealPipelines",
            },
            {
              name: "Document",
              value: "documents",
            },
            {
              name: "Email",
              value: "emails",
            },
            {
              name: "Event",
              value: "events",
            },
            {
              name: "Feature",
              value: "features",
            },
            {
              name: "Location",
              value: "locations",
            },
            {
              name: "Note",
              value: "notes",
            },
            {
              name: "Portal Export",
              value: "portalExport",
            },
            {
              name: "Project",
              value: "projects",
            },
            {
              name: "Property",
              value: "properties",
            },
            {
              name: "Search Profile",
              value: "searchProfiles",
            },
            {
              name: "Task",
              value: "tasks",
            },
            {
              name: "Team",
              value: "teams",
            },
            {
              name: "Webhook",
              value: "webhooks",
            },
          ],
          default: "contacts",
        },
        ...activitiesOperations,
        ...activitiesFields,
        ...brokersOperations,
        ...brokersFields,
        ...contactsDescription,
        ...customFieldsOperations,
        ...customFieldsFields,
        ...dealsDescription,
        ...dealPipelinesOperations,
        ...dealPipelinesFields,
        ...documentsDescription,
        ...emailsDescription,
        ...eventsOperations,
        ...eventsFields,
        ...featuresOperations,
        ...featuresFields,
        ...locationsOperations,
        ...locationsFields,
        ...notesOperations,
        ...notesFields,
        ...portalExportOperations,
        ...portalExportFields,
        ...projectsDescription,
        ...propertiesDescription,
        ...searchProfilesOperations,
        ...searchProfilesFields,
        ...tasksOperations,
        ...tasksFields,
        ...teamsOperations,
        ...teamsFields,
        ...webhooksOperations,
        ...webhooksFields,
      ],
    };
  }

  methods = {
    listSearch: {
      searchActivities,
      searchContacts,
      searchDeals,
      searchDealPipelines,
      searchDocuments,
      searchEmails,
      searchParentFeatures,
      searchProjects,
      searchProperties,
      searchSearchProfiles,
      searchTasks,
      searchTeams,
      searchWebhooks,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    await this.getCredentials("propstackApi");

    const handlers: Record<
      string,
      Record<
        string,
        (this: IExecuteFunctions) => Promise<INodeExecutionData[]>
      >
    > = {
      activities: {
        get: activitiesGet,
        getAll: activitiesGetAll,
        getActivityTypes: activityTypesGetAll,
        getReservationReasons: reservationReasonsGetAll,
      },
      brokers: {
        getAll: brokersGetAll,
      },
      customFields: {
        getAll: customFieldsGetAll,
      },
      contacts: {
        create: contactsCreate,
        delete: contactsDelete,
        get: contactsGet,
        getAll: contactsGetAll,
        update: contactsUpdate,
      },
      deals: {
        create: dealsCreate,
        delete: dealsDelete,
        get: dealsGet,
        getAll: dealsGetAll,
        update: dealsUpdate,
      },
      dealPipelines: {
        get: dealPipelinesGet,
        getAll: dealPipelinesGetAll,
      },
      documents: {
        create: documentsCreate,
        delete: documentsDelete,
        get: documentsGet,
        getAll: documentsGetAll,
        update: documentsUpdate,
      },
      emails: {
        get: emailsGet,
        getAll: emailsGetAll,
        send: emailsSend,
        update: emailsUpdate,
      },
      events: {
        getAll: eventsGetAll,
      },
      features: {
        create: featuresCreate,
        getAll: featuresGetAll,
        getParentFeatures: featuresParentGetAll,
      },
      locations: {
        getAll: locationsGetAll,
      },
      notes: {
        getAll: notesGetAll,
      },
      portalExport: {
        publish: portalExportPublish,
      },
      projects: {
        create: projectsCreate,
        get: projectsGet,
        getAll: projectsGetAll,
        update: projectsUpdate,
      },
      properties: {
        create: propertiesCreate,
        delete: propertiesDelete,
        get: propertiesGet,
        getAll: propertiesGetAll,
        update: propertiesUpdate,
      },
      searchProfiles: {
        create: searchProfilesCreate,
        delete: searchProfilesDelete,
        getAll: searchProfilesGetAll,
        update: searchProfilesUpdate,
      },
      tasks: {
        create: tasksCreate,
        delete: tasksDelete,
        get: tasksGet,
        getAll: tasksGetAll,
        update: tasksUpdate,
      },
      teams: {
        create: teamsCreate,
        delete: teamsDelete,
        get: teamsGet,
        getAll: teamsGetAll,
        update: teamsUpdate,
      },
      webhooks: {
        create: webhooksCreate,
        delete: webhooksDelete,
        getAll: webhooksGetAll,
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
