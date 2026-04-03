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
} from "../../../nodes/Propstack/v1/listSearch";
import { createMockLoadOptionsFunctions, getHttpRequestOptions, getAllHttpRequestCalls } from "./testHelpers";

describe("listSearch", () => {
  describe("searchActivities", () => {
    it("returns mapped activities", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: { data: [
          { id: 1, title: "Call with client" },
          { id: 2, title: "Site visit" },
        ] },
      });

      const result = await searchActivities.call(mock);

      expect(result.results).toEqual([
        { name: "Call with client", value: "1" },
        { name: "Site visit", value: "2" },
      ]);
    });

    it("uses fallback name when title is missing", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: { data: [{ id: 5 }] },
      });

      const result = await searchActivities.call(mock);

      expect(result.results).toEqual([{ name: "Activity #5", value: "5" }]);
    });

    it("filters by name when filter is provided", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: { data: [
          { id: 1, title: "Call with client" },
          { id: 2, title: "Site visit" },
        ] },
      });

      const result = await searchActivities.call(mock, "call");

      expect(result.results).toEqual([{ name: "Call with client", value: "1" }]);
    });

    it("excludes items without id", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: { data: [{ title: "No ID" }, { id: 1, title: "Has ID" }] },
      });

      const result = await searchActivities.call(mock);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].value).toBe("1");
    });

    it("handles empty data array", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: { data: [] },
      });

      const result = await searchActivities.call(mock);

      expect(result.results).toEqual([]);
    });

    it("passes correct request options", async () => {
      const mock = createMockLoadOptionsFunctions({ httpResponse: { data: [] } });

      await searchActivities.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/activities");
      expect(opts.qs).toEqual({ per: 100 });
    });
  });

  describe("searchContacts", () => {
    it("returns full name from first and last name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, first_name: "John", last_name: "Doe" }],
      });

      const result = await searchContacts.call(mock);

      expect(result.results).toEqual([{ name: "John Doe", value: "1" }]);
    });

    it("returns only first name when last name missing", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, first_name: "Jane" }],
      });

      const result = await searchContacts.call(mock);

      expect(result.results).toEqual([{ name: "Jane", value: "1" }]);
    });

    it("uses fallback name when no name provided", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 99 }],
      });

      const result = await searchContacts.call(mock);

      expect(result.results).toEqual([{ name: "Contact #99", value: "99" }]);
    });

    it("passes filter as q parameter", async () => {
      const mock = createMockLoadOptionsFunctions({ httpResponse: [] });

      await searchContacts.call(mock, "john");

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.q).toBe("john");
      expect(opts.qs.per).toBe(100);
    });

    it("does not pass q when no filter", async () => {
      const mock = createMockLoadOptionsFunctions({ httpResponse: [] });

      await searchContacts.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs).toEqual({ per: 100 });
    });
  });

  describe("searchDeals", () => {
    it("formats deal with client and property info", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [
          {
            id: 1,
            client: { first_name: "John", last_name: "Doe" },
            property: { title: "Nice Apartment" },
          },
        ],
      });

      const result = await searchDeals.call(mock);

      expect(result.results).toEqual([
        { name: "Deal #1 - John Doe - Nice Apartment", value: "1" },
      ]);
    });

    it("formats deal without client/property", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 42 }],
      });

      const result = await searchDeals.call(mock);

      expect(result.results).toEqual([{ name: "Deal #42", value: "42" }]);
    });

    it("filters deals by name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [
          { id: 1, client: { first_name: "John" } },
          { id: 2, client: { first_name: "Jane" } },
        ],
      });

      const result = await searchDeals.call(mock, "jane");

      expect(result.results).toHaveLength(1);
      expect(result.results[0].value).toBe("2");
    });

    it("requests with include=client,property", async () => {
      const mock = createMockLoadOptionsFunctions({ httpResponse: [] });

      await searchDeals.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.include).toBe("client,property");
    });
  });

  describe("searchDealPipelines", () => {
    it("returns pipeline names", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [
          { id: 1, name: "Sales Pipeline" },
          { id: 2, name: "Rental Pipeline" },
        ],
      });

      const result = await searchDealPipelines.call(mock);

      expect(result.results).toEqual([
        { name: "Sales Pipeline", value: "1" },
        { name: "Rental Pipeline", value: "2" },
      ]);
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 3 }],
      });

      const result = await searchDealPipelines.call(mock);

      expect(result.results).toEqual([{ name: "Pipeline #3", value: "3" }]);
    });

    it("filters pipelines", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [
          { id: 1, name: "Sales" },
          { id: 2, name: "Rental" },
        ],
      });

      const result = await searchDealPipelines.call(mock, "rental");

      expect(result.results).toHaveLength(1);
    });
  });

  describe("searchDocuments", () => {
    it("returns document names", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Contract.pdf" }],
      });

      const result = await searchDocuments.call(mock);

      expect(result.results).toEqual([{ name: "Contract.pdf", value: "1" }]);
    });

    it("uses title as fallback", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, title: "Floor Plan" }],
      });

      const result = await searchDocuments.call(mock);

      expect(result.results).toEqual([{ name: "Floor Plan", value: "1" }]);
    });

    it("uses fallback name when no name or title", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 7 }],
      });

      const result = await searchDocuments.call(mock);

      expect(result.results).toEqual([{ name: "Document #7", value: "7" }]);
    });
  });

  describe("searchEmails", () => {
    it("returns email subjects", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, subject: "Re: Property Inquiry" }],
      });

      const result = await searchEmails.call(mock);

      expect(result.results).toEqual([{ name: "Re: Property Inquiry", value: "1" }]);
    });

    it("uses fallback for missing subject", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 3 }],
      });

      const result = await searchEmails.call(mock);

      expect(result.results).toEqual([{ name: "Email #3", value: "3" }]);
    });
  });

  describe("searchParentFeatures", () => {
    it("fetches for all three entity types", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Category A" }],
      });

      const result = await searchParentFeatures.call(mock);

      const calls = getAllHttpRequestCalls(mock);
      expect(calls).toHaveLength(3);
      expect(calls[0].qs.entity).toBe("for_clients");
      expect(calls[1].qs.entity).toBe("for_properties");
      expect(calls[2].qs.entity).toBe("for_activities");

      // Each entity type returns one result = 3 total
      expect(result.results).toHaveLength(3);
    });

    it("includes entity type in name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Cat A" }],
      });

      const result = await searchParentFeatures.call(mock);

      expect(result.results[0].name).toBe("Cat A (clients)");
      expect(result.results[1].name).toBe("Cat A (properties)");
      expect(result.results[2].name).toBe("Cat A (activities)");
    });

    it("filters across all entity types", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Premium" }],
      });

      const result = await searchParentFeatures.call(mock, "clients");

      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toContain("clients");
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 9 }],
      });

      const result = await searchParentFeatures.call(mock);

      expect(result.results[0].name).toBe("Parent Feature #9 (clients)");
    });
  });

  describe("searchProjects", () => {
    it("returns project title", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, title: "New Building" }],
      });

      const result = await searchProjects.call(mock);

      expect(result.results).toEqual([{ name: "New Building", value: "1" }]);
    });

    it("uses name as fallback", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Project A" }],
      });

      const result = await searchProjects.call(mock);

      expect(result.results).toEqual([{ name: "Project A", value: "1" }]);
    });

    it("uses fallback name when no title or name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 4 }],
      });

      const result = await searchProjects.call(mock);

      expect(result.results).toEqual([{ name: "Project #4", value: "4" }]);
    });
  });

  describe("searchProperties", () => {
    it("returns property titles", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, title: "Cozy Studio" }],
      });

      const result = await searchProperties.call(mock);

      expect(result.results).toEqual([{ name: "Cozy Studio", value: "1" }]);
    });

    it("passes filter as q parameter", async () => {
      const mock = createMockLoadOptionsFunctions({ httpResponse: [] });

      await searchProperties.call(mock, "studio");

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.q).toBe("studio");
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 8 }],
      });

      const result = await searchProperties.call(mock);

      expect(result.results).toEqual([{ name: "Property #8", value: "8" }]);
    });
  });

  describe("searchSearchProfiles", () => {
    it("returns profile names", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Berlin 2BR" }],
      });

      const result = await searchSearchProfiles.call(mock);

      expect(result.results).toEqual([{ name: "Berlin 2BR", value: "1" }]);
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 6 }],
      });

      const result = await searchSearchProfiles.call(mock);

      expect(result.results).toEqual([{ name: "Search Profile #6", value: "6" }]);
    });
  });

  describe("searchTasks", () => {
    it("returns task titles", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, title: "Follow up" }],
      });

      const result = await searchTasks.call(mock);

      expect(result.results).toEqual([{ name: "Follow up", value: "1" }]);
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 3 }],
      });

      const result = await searchTasks.call(mock);

      expect(result.results).toEqual([{ name: "Task #3", value: "3" }]);
    });
  });

  describe("searchTeams", () => {
    it("returns team names", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, name: "Sales Team" }],
      });

      const result = await searchTeams.call(mock);

      expect(result.results).toEqual([{ name: "Sales Team", value: "1" }]);
    });

    it("uses fallback name", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 2 }],
      });

      const result = await searchTeams.call(mock);

      expect(result.results).toEqual([{ name: "Team #2", value: "2" }]);
    });
  });

  describe("searchWebhooks", () => {
    it("formats event and target_url", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 1, event: "client.created", target_url: "https://example.com/hook" }],
      });

      const result = await searchWebhooks.call(mock);

      expect(result.results).toEqual([
        { name: "client.created → https://example.com/hook", value: "1" },
      ]);
    });

    it("uses fallback when event or target_url missing", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [{ id: 5, event: "client.created" }],
      });

      const result = await searchWebhooks.call(mock);

      expect(result.results).toEqual([{ name: "Webhook #5", value: "5" }]);
    });

    it("filters webhooks", async () => {
      const mock = createMockLoadOptionsFunctions({
        httpResponse: [
          { id: 1, event: "client.created", target_url: "https://a.com" },
          { id: 2, event: "property.updated", target_url: "https://b.com" },
        ],
      });

      const result = await searchWebhooks.call(mock, "property");

      expect(result.results).toHaveLength(1);
      expect(result.results[0].value).toBe("2");
    });
  });
});
