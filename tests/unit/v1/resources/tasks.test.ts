import { tasksCreate } from "../../../../nodes/Propstack/v1/resources/tasks/create";
import { tasksGet } from "../../../../nodes/Propstack/v1/resources/tasks/get";
import { tasksGetAll } from "../../../../nodes/Propstack/v1/resources/tasks/getAll";
import { tasksUpdate } from "../../../../nodes/Propstack/v1/resources/tasks/update";
import { tasksDelete } from "../../../../nodes/Propstack/v1/resources/tasks/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("tasks", () => {
  describe("create", () => {
    it("sends POST to /v1/tasks with task body", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          title: "Follow up with client",
          additionalFields: {
            broker_id: "5",
            is_reminder: true,
            due_date: "2025-06-01",
          },
        },
        httpResponse: { id: 1, title: "Follow up with client" },
      });

      const result = await tasksCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/tasks");
      expect(opts.body.task.title).toBe("Follow up with client");
      expect(opts.body.task.broker_id).toBe("5");
      expect(opts.body.task.is_reminder).toBe(true);
      expect(opts.body.task.due_date).toBe("2025-06-01");
      expect(result).toHaveLength(1);
    });

    it("splits association IDs into integer arrays", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          title: "Task",
          additionalFields: {
            client_ids: "10, 20",
            property_ids: "30, 40",
            project_ids: "50",
          },
        },
        httpResponse: { id: 2 },
      });

      await tasksCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.task.client_ids).toEqual([10, 20]);
      expect(opts.body.task.property_ids).toEqual([30, 40]);
      expect(opts.body.task.project_ids).toEqual([50]);
    });

    it("handles event fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          title: "Meeting",
          additionalFields: {
            is_event: true,
            starts_at: "2025-06-01T10:00:00",
            ends_at: "2025-06-01T11:00:00",
            location: "Office",
            all_day: false,
            private: true,
            recurring: true,
            rrule: "FREQ=WEEKLY",
          },
        },
        httpResponse: { id: 3 },
      });

      await tasksCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.task.is_event).toBe(true);
      expect(opts.body.task.starts_at).toBe("2025-06-01T10:00:00");
      expect(opts.body.task.ends_at).toBe("2025-06-01T11:00:00");
      expect(opts.body.task.location).toBe("Office");
      expect(opts.body.task.all_day).toBe(false);
      expect(opts.body.task.private).toBe(true);
      expect(opts.body.task.recurring).toBe(true);
      expect(opts.body.task.rrule).toBe("FREQ=WEEKLY");
    });
  });

  describe("get", () => {
    it("sends GET to /v1/tasks/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { taskId: { value: "33" } },
        httpResponse: { id: 33, title: "Call" },
      });

      const result = await tasksGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/tasks/33");
      expect(result[0].json.title).toBe("Call");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/tasks with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 15,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }],
      });

      const result = await tasksGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/tasks");
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/tasks/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          taskId: { value: "44" },
          additionalFields: { title: "Updated Task", done: true },
        },
        httpResponse: { id: 44, title: "Updated Task" },
      });

      const result = await tasksUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/tasks/44");
      expect(result[0].json.title).toBe("Updated Task");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/tasks/{id} and returns success", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { taskId: { value: "55" } },
        httpResponse: {},
      });

      const result = await tasksDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/tasks/55");
      expect(result[0].json).toEqual(
        expect.objectContaining({ success: true, id: "55" }),
      );
    });
  });
});
