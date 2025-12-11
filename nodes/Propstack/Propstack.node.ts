import type { INodeTypeBaseDescription, IVersionedNodeType } from "n8n-workflow";
import { VersionedNodeType } from 'n8n-workflow';

import { PropstackV1 } from "./v1/PropstackV1";
import { PropstackV2 } from "./v2/PropstackV2";

export class Propstack extends VersionedNodeType {
  constructor() {
    const baseDescription: INodeTypeBaseDescription = {
      displayName: "Propstack",
      name: "propstack",
      icon: {
        light: "file:../../icons/propstack.svg",
        dark: "file:../../icons/propstack.dark.svg",
      },
      group: [],
      description: "Interact with the Propstack CRM API",
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
      defaultVersion: 1,
      usableAsTool: true,
    };

    const nodeVersions: IVersionedNodeType["nodeVersions"] = {
      1: new PropstackV1(baseDescription),
      2: new PropstackV2(baseDescription),
    };

    super(nodeVersions, baseDescription);
  }
}
