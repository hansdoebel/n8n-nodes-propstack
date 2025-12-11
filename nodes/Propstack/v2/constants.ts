export const API_V2_BASE_URL = "https://api.propstack.de";

export const V2 = {
  PROPERTIES: "/v2/properties",
  PROPERTY: (id: string) => `/v2/properties/${id}`,
  PROPERTIES_SCROLL: "/v2/properties/scroll",
  PROPERTIES_DELETED: "/v2/properties/deleted",
  PROPERTIES_OPTIONS: "/v2/properties/options",
  PROPERTY_LINKS: (propertyId: string) => `/v2/properties/${propertyId}/links`,
  PROPERTY_LINK: (propertyId: string, linkId: string) =>
    `/v2/properties/${propertyId}/links/${linkId}`,

  CLIENTS: "/v2/clients",
  CLIENT: (id: string) => `/v2/clients/${id}`,
  CLIENTS_SCROLL: "/v2/clients/scroll",
  CLIENTS_DELETED: "/v2/clients/deleted",

  CLIENT_PROPERTIES: "/v2/client_properties",
  CLIENT_PROPERTY: (id: string) => `/v2/client_properties/${id}`,
  CLIENT_PROPERTIES_SCROLL: "/v2/client_properties/scroll",

  PROJECTS: "/v2/projects",
  PROJECT: (id: string) => `/v2/projects/${id}`,

  BROKERS: "/v2/brokers",
  BROKER: (id: string) => `/v2/brokers/${id}`,

  CUSTOM_FIELDS: "/v2/custom_fields",
  CUSTOM_FIELD: (id: string) => `/v2/custom_fields/${id}`,
  CUSTOM_FIELD_OPTIONS: (fieldId: string) =>
    `/v2/custom_fields/${fieldId}/custom_options`,
  CUSTOM_FIELD_OPTION: (fieldId: string, optionId: string) =>
    `/v2/custom_fields/${fieldId}/custom_options/${optionId}`,

  SNIPPETS: "/v2/snippets",
  SNIPPET: (id: string) => `/v2/snippets/${id}`,
  SNIPPET_ATTACHMENTS: (snippetId: string) =>
    `/v2/snippets/${snippetId}/attachments`,

  RELATIONSHIPS: "/v2/relationships",
  RELATIONSHIP: (id: string) => `/v2/relationships/${id}`,

  HISTORY_MESSAGES: (id: string) => `/v2/history/messages/${id}`,
  HISTORY_NOTES: (id: string) => `/v2/history/notes/${id}`,
  HISTORY_EVENTS: (id: string) => `/v2/history/events/${id}`,
  HISTORY_TASKS: (id: string) => `/v2/history/tasks/${id}`,
  HISTORY_DEALS: (id: string) => `/v2/history/deals/${id}`,

  ACTIVITIES_SCROLL: "/v2/activities/scroll",

  NOTE_ATTACHMENTS: "/v2/note_attachments",

  PROPERTY_STATUSES: "/v2/property_statuses",
  PUBLISHINGS: "/v2/publishings",
  PORTALS: "/v2/portals",
  CLIENT_STATUSES: "/v2/client_statuses",
  CLIENT_SOURCES: "/v2/client_sources",
  SNIPPET_CATEGORIES: "/v2/snippet_categories",
  GROUPS: "/v2/groups",
  FOLDERS: "/v2/folders",
  COMMENTS: "/v2/comments",
  MESSAGE_TRACKINGS: "/v2/message_trackings",
  RECIPES: "/v2/recipes",
  RIGHTS: "/v2/rights",
};
