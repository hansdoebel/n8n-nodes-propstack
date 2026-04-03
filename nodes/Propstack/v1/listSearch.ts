import type {
  IDataObject,
  ILoadOptionsFunctions,
  INodeListSearchResult,
} from "n8n-workflow";
import { API_ENDPOINTS } from "./constants";
import { propstackRequest } from "./helpers";

export async function searchActivities(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = (await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.ACTIVITIES_GET_ALL,
    qs: { per: 100 },
  })) as { data?: IDataObject[] };
  const items = Array.isArray(response.data) ? response.data : [];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.title || `Activity #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchContacts(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const qs: IDataObject = { per: 100 };
  if (filter) qs.q = filter;
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.CONTACTS_GET_ALL,
    qs,
  });
  const items = Array.isArray(response) ? response : [response];
  const results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name:
        [item.first_name, item.last_name].filter(Boolean).join(" ") ||
        `Contact #${item.id}`,
      value: String(item.id),
    }));
  return { results };
}

export async function searchDeals(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = (await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DEALS_GET_ALL,
    qs: { per: 100, include: "client,property" },
  })) as { data?: IDataObject[] };
  const items = Array.isArray(response.data) ? response.data : [];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => {
      const parts: string[] = [`Deal #${item.id}`];
      const client = item.client as IDataObject | undefined;
      const property = item.property as IDataObject | undefined;
      if (client?.first_name || client?.last_name) {
        parts.push(
          [client.first_name, client.last_name]
            .filter(Boolean)
            .join(" "),
        );
      }
      if (property?.title) {
        parts.push(String(property.title));
      }
      return {
        name: parts.join(" - "),
        value: String(item.id),
      };
    });
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchDealPipelines(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = (await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DEAL_PIPELINES_GET_ALL,
  })) as { data?: IDataObject[] };
  const items = Array.isArray(response.data) ? response.data : [];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.name || `Pipeline #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchDocuments(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = (await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.DOCUMENTS_GET_ALL,
    qs: { per: 100 },
  })) as { documents?: IDataObject[] };
  const items = Array.isArray(response.documents) ? response.documents : [];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.name || item.title || `Document #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}


export async function searchParentFeatures(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const entities = ["for_clients", "for_properties", "for_activities"];
  let allResults: Array<{ name: string; value: string }> = [];

  for (const entity of entities) {
    const response = await propstackRequest.call(this, {
      method: "GET",
      url: API_ENDPOINTS.FEATURES_PARENT_GET_ALL,
      qs: { entity },
    });
    const items = Array.isArray(response) ? response : [response];
    allResults = allResults.concat(
      items
        .filter((item: IDataObject) => item && item.id)
        .map((item: IDataObject) => ({
          name: `${item.name || `Parent Feature #${item.id}`} (${entity.replace("for_", "")})`,
          value: String(item.id),
        })),
    );
  }

  if (filter) {
    const lowerFilter = filter.toLowerCase();
    allResults = allResults.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results: allResults };
}

export async function searchProjects(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROJECTS_GET_ALL,
    qs: { per: 100 },
  });
  const items = Array.isArray(response) ? response : [response];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.title || item.name || `Project #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchProperties(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const qs: IDataObject = { per: 100 };
  if (filter) qs.q = filter;
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.PROPERTIES_GET_ALL,
    qs,
  });
  const items = Array.isArray(response) ? response : [response];
  const results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.title || `Property #${item.id}`),
      value: String(item.id),
    }));
  return { results };
}

export async function searchSearchProfiles(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.SEARCH_PROFILES_GET_ALL,
    qs: { per: 100 },
  });
  const items = Array.isArray(response) ? response : [response];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.name || `Search Profile #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchTasks(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TASKS_GET_ALL,
    qs: { per: 100 },
  });
  const items = Array.isArray(response) ? response : [response];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.title || `Task #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchTeams(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.TEAMS_GET_ALL,
    qs: { per: 100 },
  });
  const items = Array.isArray(response) ? response : [response];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(item.name || `Team #${item.id}`),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}

export async function searchWebhooks(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  const response = await propstackRequest.call(this, {
    method: "GET",
    url: API_ENDPOINTS.WEBHOOKS_GET_ALL,
  });
  const items = Array.isArray(response) ? response : [response];
  let results = items
    .filter((item: IDataObject) => item && item.id)
    .map((item: IDataObject) => ({
      name: String(
        item.event && item.target_url
          ? `${item.event} → ${item.target_url}`
          : `Webhook #${item.id}`,
      ),
      value: String(item.id),
    }));
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(lowerFilter),
    );
  }
  return { results };
}
