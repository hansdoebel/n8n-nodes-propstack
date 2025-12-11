import type {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class PropstackV2Api implements ICredentialType {
  name = "propstackV2Api";

  displayName = "Propstack V2 API";

  documentationUrl = "https://docs.propstack.de/reference/introduction";

  icon: Icon = {
    light: "file:../icons/propstack.svg",
    dark: "file:../icons/propstack.dark.svg",
  };

  properties: INodeProperties[] = [
    {
      displayName: "API Token",
      name: "apiToken",
      type: "string",
      typeOptions: { password: true },
      required: true,
      default: "",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        "X-Api-Key": "={{$credentials.apiToken}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://api.propstack.de",
      url: "/v2/brokers",
      qs: { per: 1 },
    },
  };
}
