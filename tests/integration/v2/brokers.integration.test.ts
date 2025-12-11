import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration V2: Brokers", () => {
  it("lists brokers", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v2/brokers",
      qs: { per: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });
});
