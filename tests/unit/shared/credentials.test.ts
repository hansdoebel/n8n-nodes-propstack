import type { Icon } from "n8n-workflow";
import { PropstackApi } from "../../../credentials/PropstackApi.credentials";

describe("PropstackApi Credentials", () => {
  const creds = new PropstackApi();

  it("has correct name", () => {
    expect(creds.name).toBe("propstackApi");
  });

  it("has correct display name", () => {
    expect(creds.displayName).toBe("Propstack API");
  });

  it("has documentation URL", () => {
    expect(creds.documentationUrl).toBe("https://docs.propstack.de/reference/introduction");
  });

  it("has apiToken property configured as password", () => {
    const tokenProp = creds.properties.find((p) => p.name === "apiToken");
    expect(tokenProp).toBeDefined();
    expect(tokenProp!.type).toBe("string");
    expect(tokenProp!.typeOptions?.password).toBe(true);
    expect(tokenProp!.required).toBe(true);
  });

  it("uses generic header authentication with X-API-KEY", () => {
    expect(creds.authenticate.type).toBe("generic");
    expect(creds.authenticate.properties.headers).toEqual({
      "X-API-KEY": "={{$credentials.apiToken}}",
    });
  });

  it("has test request pointing to contacts endpoint", () => {
    expect(creds.test.request.baseURL).toBe("https://api.propstack.de");
    expect(creds.test.request.url).toBe("/v1/contacts");
  });

  it("has light and dark icons", () => {
    expect(creds.icon).toBeDefined();
    expect((creds.icon as Icon).light).toContain("propstack.svg");
    expect((creds.icon as Icon).dark).toContain("propstack.dark.svg");
  });
});
