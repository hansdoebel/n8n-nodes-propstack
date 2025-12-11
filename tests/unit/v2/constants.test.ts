import { V2, API_V2_BASE_URL } from "../../../nodes/Propstack/v2/constants";

describe("v2 constants", () => {
  it("has correct base URL", () => {
    expect(API_V2_BASE_URL).toBe("https://api.propstack.de");
  });

  describe("static endpoints", () => {
    it("properties", () => {
      expect(V2.PROPERTIES).toBe("/v2/properties");
    });

    it("clients", () => {
      expect(V2.CLIENTS).toBe("/v2/clients");
    });

    it("client_properties", () => {
      expect(V2.CLIENT_PROPERTIES).toBe("/v2/client_properties");
    });

    it("projects", () => {
      expect(V2.PROJECTS).toBe("/v2/projects");
    });

    it("brokers", () => {
      expect(V2.BROKERS).toBe("/v2/brokers");
    });

    it("custom_fields", () => {
      expect(V2.CUSTOM_FIELDS).toBe("/v2/custom_fields");
    });

    it("snippets", () => {
      expect(V2.SNIPPETS).toBe("/v2/snippets");
    });

    it("relationships", () => {
      expect(V2.RELATIONSHIPS).toBe("/v2/relationships");
    });

    it("activities_scroll", () => {
      expect(V2.ACTIVITIES_SCROLL).toBe("/v2/activities/scroll");
    });

    it("note_attachments", () => {
      expect(V2.NOTE_ATTACHMENTS).toBe("/v2/note_attachments");
    });

    it("property_statuses", () => {
      expect(V2.PROPERTY_STATUSES).toBe("/v2/property_statuses");
    });

    it("publishings", () => {
      expect(V2.PUBLISHINGS).toBe("/v2/publishings");
    });

    it("portals", () => {
      expect(V2.PORTALS).toBe("/v2/portals");
    });

    it("client_statuses", () => {
      expect(V2.CLIENT_STATUSES).toBe("/v2/client_statuses");
    });

    it("client_sources", () => {
      expect(V2.CLIENT_SOURCES).toBe("/v2/client_sources");
    });

    it("snippet_categories", () => {
      expect(V2.SNIPPET_CATEGORIES).toBe("/v2/snippet_categories");
    });

    it("groups", () => {
      expect(V2.GROUPS).toBe("/v2/groups");
    });

    it("folders", () => {
      expect(V2.FOLDERS).toBe("/v2/folders");
    });

    it("comments", () => {
      expect(V2.COMMENTS).toBe("/v2/comments");
    });

    it("message_trackings", () => {
      expect(V2.MESSAGE_TRACKINGS).toBe("/v2/message_trackings");
    });

    it("recipes", () => {
      expect(V2.RECIPES).toBe("/v2/recipes");
    });

    it("rights", () => {
      expect(V2.RIGHTS).toBe("/v2/rights");
    });
  });

  describe("dynamic endpoints", () => {
    it("property by id", () => {
      expect(V2.PROPERTY("1")).toBe("/v2/properties/1");
    });

    it("client by id", () => {
      expect(V2.CLIENT("2")).toBe("/v2/clients/2");
    });

    it("client_property by id", () => {
      expect(V2.CLIENT_PROPERTY("3")).toBe("/v2/client_properties/3");
    });

    it("project by id", () => {
      expect(V2.PROJECT("4")).toBe("/v2/projects/4");
    });

    it("broker by id", () => {
      expect(V2.BROKER("5")).toBe("/v2/brokers/5");
    });

    it("custom_field by id", () => {
      expect(V2.CUSTOM_FIELD("6")).toBe("/v2/custom_fields/6");
    });

    it("snippet by id", () => {
      expect(V2.SNIPPET("7")).toBe("/v2/snippets/7");
    });

    it("relationship by id", () => {
      expect(V2.RELATIONSHIP("8")).toBe("/v2/relationships/8");
    });

    it("property_links by property id", () => {
      expect(V2.PROPERTY_LINKS("10")).toBe("/v2/properties/10/links");
    });

    it("property_link by property and link id", () => {
      expect(V2.PROPERTY_LINK("10", "20")).toBe("/v2/properties/10/links/20");
    });

    it("custom_field_options by field id", () => {
      expect(V2.CUSTOM_FIELD_OPTIONS("6")).toBe("/v2/custom_fields/6/custom_options");
    });

    it("custom_field_option by field and option id", () => {
      expect(V2.CUSTOM_FIELD_OPTION("6", "7")).toBe("/v2/custom_fields/6/custom_options/7");
    });

    it("snippet_attachments by snippet id", () => {
      expect(V2.SNIPPET_ATTACHMENTS("7")).toBe("/v2/snippets/7/attachments");
    });

    it("history_messages by id", () => {
      expect(V2.HISTORY_MESSAGES("1")).toBe("/v2/history/messages/1");
    });

    it("history_notes by id", () => {
      expect(V2.HISTORY_NOTES("2")).toBe("/v2/history/notes/2");
    });

    it("history_events by id", () => {
      expect(V2.HISTORY_EVENTS("3")).toBe("/v2/history/events/3");
    });

    it("history_tasks by id", () => {
      expect(V2.HISTORY_TASKS("4")).toBe("/v2/history/tasks/4");
    });

    it("history_deals by id", () => {
      expect(V2.HISTORY_DEALS("5")).toBe("/v2/history/deals/5");
    });
  });
});
