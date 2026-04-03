import { API_ENDPOINTS } from "../../../nodes/Propstack/v1/constants";

describe("API_ENDPOINTS", () => {
  it("has correct base URL", () => {
    expect(API_ENDPOINTS.BASE_URL).toBe("https://api.propstack.de");
  });

  describe("contacts", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.CONTACTS_CREATE).toBe("/v1/contacts");
      expect(API_ENDPOINTS.CONTACTS_GET_ALL).toBe("/v1/contacts");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.CONTACTS_GET("123")).toBe("/v1/contacts/123");
      expect(API_ENDPOINTS.CONTACTS_UPDATE("456")).toBe("/v1/contacts/456");
      expect(API_ENDPOINTS.CONTACTS_DELETE("789")).toBe("/v1/contacts/789");
    });
  });

  describe("properties", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.PROPERTIES_CREATE).toBe("/v1/units");
      expect(API_ENDPOINTS.PROPERTIES_GET_ALL).toBe("/v1/units");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.PROPERTIES_GET("10")).toBe("/v1/units/10");
      expect(API_ENDPOINTS.PROPERTIES_UPDATE("20")).toBe("/v1/units/20");
      expect(API_ENDPOINTS.PROPERTIES_DELETE("30")).toBe("/v1/units/30");
    });
  });

  describe("deals", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.DEALS_CREATE).toBe("/v1/client_properties");
      expect(API_ENDPOINTS.DEALS_GET_ALL).toBe("/v1/client_properties");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.DEALS_GET("5")).toBe("/v1/client_properties/5");
      expect(API_ENDPOINTS.DEALS_UPDATE("6")).toBe("/v1/client_properties/6");
      expect(API_ENDPOINTS.DEALS_DELETE("7")).toBe("/v1/client_properties/7");
    });
  });

  describe("snippets", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.SNIPPETS_GET_ALL).toBe("/v1/snippets");
    });
  });

  describe("emails", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.EMAILS_SEND).toBe("/v1/messages");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.EMAILS_GET("1")).toBe("/v1/messages/1");
      expect(API_ENDPOINTS.EMAILS_UPDATE("2")).toBe("/v1/messages/2");
    });
  });

  describe("documents", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.DOCUMENTS_CREATE).toBe("/v1/documents");
      expect(API_ENDPOINTS.DOCUMENTS_GET_ALL).toBe("/v1/documents");
      expect(API_ENDPOINTS.DOCUMENTS_TAGS_GET_ALL).toBe("/v1/documents/tags");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.DOCUMENTS_GET("11")).toBe("/v1/documents/11");
      expect(API_ENDPOINTS.DOCUMENTS_UPDATE("12")).toBe("/v1/documents/12");
      expect(API_ENDPOINTS.DOCUMENTS_DELETE("13")).toBe("/v1/documents/13");
    });
  });

  describe("projects", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.PROJECTS_CREATE).toBe("/v1/projects");
      expect(API_ENDPOINTS.PROJECTS_GET_ALL).toBe("/v1/projects");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.PROJECTS_GET("1")).toBe("/v1/projects/1");
      expect(API_ENDPOINTS.PROJECTS_UPDATE("2")).toBe("/v1/projects/2");
    });
  });

  describe("tasks", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.TASKS_CREATE).toBe("/v1/tasks");
      expect(API_ENDPOINTS.TASKS_GET_ALL).toBe("/v1/tasks");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.TASKS_GET("1")).toBe("/v1/tasks/1");
      expect(API_ENDPOINTS.TASKS_UPDATE("2")).toBe("/v1/tasks/2");
      expect(API_ENDPOINTS.TASKS_DELETE("3")).toBe("/v1/tasks/3");
    });
  });

  describe("teams", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.TEAMS_GET_ALL).toBe("/v1/teams");
    });
  });

  describe("activities", () => {
    it("has correct static endpoints", () => {
      expect(API_ENDPOINTS.ACTIVITIES_GET_ALL).toBe("/v1/activities");
      expect(API_ENDPOINTS.ACTIVITY_TYPES_GET_ALL).toBe("/v1/activity_types");
      expect(API_ENDPOINTS.RESERVATION_REASONS_GET_ALL).toBe("/v1/reservation_reasons");
    });

    it("generates correct dynamic endpoints", () => {
      expect(API_ENDPOINTS.ACTIVITIES_GET("42")).toBe("/v1/activities/42");
    });
  });

  describe("other resources", () => {
    it("has correct custom fields endpoint", () => {
      expect(API_ENDPOINTS.CUSTOM_FIELDS_GET_ALL).toBe("/v1/custom_field_groups");
    });

    it("has correct deal pipelines endpoints", () => {
      expect(API_ENDPOINTS.DEAL_PIPELINES_GET_ALL).toBe("/v1/deal_pipelines");
      expect(API_ENDPOINTS.DEAL_PIPELINES_GET("1")).toBe("/v1/deal_pipelines/1");
    });

    it("has correct locations endpoint", () => {
      expect(API_ENDPOINTS.LOCATIONS_GET_ALL).toBe("/v1/locations");
    });

    it("has correct features endpoints", () => {
      expect(API_ENDPOINTS.FEATURES_CREATE).toBe("/v1/groups");
      expect(API_ENDPOINTS.FEATURES_GET_ALL).toBe("/v1/groups");
      expect(API_ENDPOINTS.FEATURES_PARENT_GET_ALL).toBe("/v1/super_groups");
    });

    it("has correct brokers endpoint", () => {
      expect(API_ENDPOINTS.BROKERS_GET_ALL).toBe("/v1/brokers");
    });

    it("has correct portal export endpoint", () => {
      expect(API_ENDPOINTS.PORTAL_EXPORT).toBe("/v1/portals/publish");
    });

    it("has correct search profiles endpoints", () => {
      expect(API_ENDPOINTS.SEARCH_PROFILES_CREATE).toBe("/v1/saved_queries");
      expect(API_ENDPOINTS.SEARCH_PROFILES_GET_ALL).toBe("/v1/saved_queries");
      expect(API_ENDPOINTS.SEARCH_PROFILES_UPDATE("1")).toBe("/v1/saved_queries/1");
      expect(API_ENDPOINTS.SEARCH_PROFILES_DELETE("2")).toBe("/v1/saved_queries/2");
    });

    it("has correct events endpoint", () => {
      expect(API_ENDPOINTS.EVENTS_GET_ALL).toBe("/v1/events");
    });

    it("has correct notes endpoint", () => {
      expect(API_ENDPOINTS.NOTES_GET_ALL).toBe("/v1/notes");
    });

    it("has correct webhooks endpoints", () => {
      expect(API_ENDPOINTS.WEBHOOKS_CREATE).toBe("/v1/hooks");
      expect(API_ENDPOINTS.WEBHOOKS_GET_ALL).toBe("/v1/hooks");
      expect(API_ENDPOINTS.WEBHOOKS_DELETE("1")).toBe("/v1/hooks/1");
    });

    it("has correct property statuses endpoint", () => {
      expect(API_ENDPOINTS.PROPERTY_STATUSES_GET_ALL).toBe("/v1/property_statuses");
    });
  });
});
