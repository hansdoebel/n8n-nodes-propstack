import type {
  IDataObject,
  ILoadOptionsFunctions,
  INodeListSearchResult,
} from "n8n-workflow";
import { V2 } from "./constants";
import { propstackV2Request } from "./helpers";

function createSearchFn(config: {
  url: string;
  qs?: IDataObject;
  labelFn: (item: IDataObject) => string;
  filterParam?: string;
}) {
  return async function (
    this: ILoadOptionsFunctions,
    filter?: string,
  ): Promise<INodeListSearchResult> {
    const qs: IDataObject = { per: 100, ...config.qs };
    if (filter && config.filterParam) {
      qs[config.filterParam] = filter;
    }

    const response = await propstackV2Request.call(this, {
      method: "GET",
      url: config.url,
      qs,
    });

    const items = Array.isArray(response) ? response : (response?.data ?? [response]);
    let results = (items as IDataObject[])
      .filter((item) => item && item.id)
      .map((item) => ({
        name: config.labelFn(item),
        value: String(item.id),
      }));

    if (filter && !config.filterParam) {
      const lowerFilter = filter.toLowerCase();
      results = results.filter((r) =>
        r.name.toLowerCase().includes(lowerFilter),
      );
    }

    return { results };
  };
}

function fullName(item: IDataObject, fallback: string): string {
  const parts = [item.first_name, item.last_name].filter(Boolean);
  return parts.length ? parts.join(" ") : fallback;
}

export const searchProperties = createSearchFn({
  url: V2.PROPERTIES,
  labelFn: (item) => String(item.title || `Property #${item.id}`),
  filterParam: "q",
});

export const searchClients = createSearchFn({
  url: V2.CLIENTS,
  labelFn: (item) => fullName(item, `Client #${item.id}`),
  filterParam: "q",
});

export const searchClientProperties = createSearchFn({
  url: V2.CLIENT_PROPERTIES,
  labelFn: (item) => {
    const parts: string[] = [`Deal #${item.id}`];
    const client = item.client as IDataObject | undefined;
    if (client?.first_name || client?.last_name) {
      parts.push(fullName(client, ""));
    }
    const property = item.property as IDataObject | undefined;
    if (property?.title) parts.push(String(property.title));
    return parts.join(" - ");
  },
});

export const searchProjects = createSearchFn({
  url: V2.PROJECTS,
  labelFn: (item) => String(item.name || item.title || `Project #${item.id}`),
});

export const searchBrokers = createSearchFn({
  url: V2.BROKERS,
  labelFn: (item) => fullName(item, `Broker #${item.id}`),
});

export const searchCustomFields = createSearchFn({
  url: V2.CUSTOM_FIELDS,
  labelFn: (item) => String(item.name || `Custom Field #${item.id}`),
});

export const searchSnippets = createSearchFn({
  url: V2.SNIPPETS,
  labelFn: (item) => String(item.name || `Snippet #${item.id}`),
});

export const searchRelationships = createSearchFn({
  url: V2.RELATIONSHIPS,
  labelFn: (item) => String(item.internal_name || `Relationship #${item.id}`),
});
