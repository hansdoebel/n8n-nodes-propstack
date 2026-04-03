<h1 align="center">
  <br>
  n8n-nodes-propstack
  <br>
</h1>

<p align="center">
	<img alt="NPM Version" src="https://img.shields.io/npm/v/n8n-nodes-propstack">
	<img alt="GitHub License" src="https://img.shields.io/github/license/hansdoebel/n8n-nodes-propstack">
	<img alt="NPM Downloads" src="https://img.shields.io/npm/dm/n8n-nodes-propstack">
	<img alt="NPM Last Update" src="https://img.shields.io/npm/last-update/n8n-nodes-propstack">
	<img alt="Static Badge" src="https://img.shields.io/badge/n8n-2.14.2-EA4B71?logo=n8n">
</p>

<p align="center">
  <a href="#installation">Installation</a> |
  <a href="#credentials">Credentials</a> |
  <a href="#resources--operations">Resources</a> |
  <a href="#development">Development</a> |
  <a href="#license">License</a>
</p>

---

A community node for [n8n](https://n8n.io/) that integrates with the [Propstack](https://www.propstack.de/) real estate CRM API. Manage contacts, properties, deals, projects, and more directly from your n8n workflows. Supports both API v1 (stable) and v2 (beta).

## API Coverage

The node ships in two versions targeting different Propstack API generations:

- **Propstack (v1)**: stable API, page-based pagination, 20 resources
- **Propstack V2**: beta API, adds scroll pagination, deleted record retrieval, and new resources
- **Propstack Trigger**: webhook-based trigger with 18 event types

<details>
<summary><strong>View v1 resources</strong></summary>

| Resource | Operations |
| --- | --- |
| Activities | Get, Get Many, Get Activity Types, Get Reservation Reasons |
| Brokers | Get Many |
| Contacts | Create, Delete, Get, Get Many, Update |
| Custom Fields | Get Many |
| Deal Pipelines | Get, Get Many |
| Deals | Create, Delete, Get, Get Many, Update |
| Documents | Create, Delete, Get, Get Many, Update |
| Emails | Get, Send, Update |
| Events | Get Many |
| Features | Create, Get Many, Get Parent Features |
| Locations | Get Many |
| Notes | Get Many |
| Portal Export | Publish |
| Projects | Create, Get, Get Many, Update |
| Properties | Create, Delete, Get, Get Many, Update |
| Search Profiles | Create, Delete, Get Many, Update |
| Snippets | Get Many |
| Tasks | Create, Delete, Get, Get Many, Update |
| Teams | Get Many |
| Webhooks | Create, Delete, Get Many |

</details>

<details>
<summary><strong>View v2 resources</strong></summary>

| Resource | Operations |
| --- | --- |
| Activities | Scroll |
| Brokers | Create, Get, Get Many, Update |
| Clients | Create, Delete, Get, Get Deleted, Get Many, Scroll, Update |
| Client Properties | Create, Delete, Get, Get Many, Scroll, Update |
| Custom Fields | Create, Create Option, Delete, Delete Option, Get, Get Many, Update |
| History | Get (messages, notes, events, tasks, deals) |
| Note Attachments | Create |
| Projects | Create, Delete, Get, Get Many, Update |
| Properties | Create, Create Link, Delete, Delete Link, Get, Get Deleted, Get Many, Get Options, Scroll, Update, Update Link |
| Reference Data | Get Many (property statuses, publishings, portals, client statuses, client sources, snippet categories, groups, folders, comments, message trackings, recipes, rights) |
| Relationships | Create, Delete, Get Many |
| Snippets | Create, Delete, Get Many, Update, Add Attachment |

</details>

<details>
<summary><strong>View trigger events</strong></summary>

| Event | Type |
| --- | --- |
| Client Created | Webhook |
| Client Updated (also fires on delete) | Webhook |
| Client Property Created | Webhook |
| Client Property Updated | Webhook |
| Client Property Deleted | Webhook |
| Document Created | Webhook |
| Document Updated | Webhook |
| Document Deleted | Webhook |
| Project Created | Webhook |
| Project Updated | Webhook |
| Property Created | Webhook |
| Property Updated (also fires on delete) | Webhook |
| Saved Query Created | Webhook |
| Saved Query Updated | Webhook |
| Saved Query Deleted | Webhook |
| Task Created | Webhook |
| Task Updated | Webhook |
| Task Deleted | Webhook |

</details>

## Installation

1. Create a new workflow or open an existing one
2. Open the nodes panel by selecting **+** or pressing **N**
3. Search for **Propstack**
4. Select **Install** to install the node for your instance

## Credentials

1. Log in to [Propstack](https://app.propstack.de/settings/api) and copy your API token
2. In n8n, go to **Credentials** > **Add credential**
3. Search for **Propstack API** (v1) or **Propstack API v2** and paste your token

Each API version uses its own credential: v1 uses `Propstack API`, v2 uses `Propstack API v2`.

## Resources & Operations

See the collapsible tables above under [API Coverage](#api-coverage) for a full list.

For a detailed comparison between v1 and v2, see [docs/v1-vs-v2.md](docs/v1-vs-v2.md).
For a comparison with the Zapier integration, see [docs/n8n-vs-zapier.md](docs/n8n-vs-zapier.md).

## Development

```bash
git clone https://github.com/hansdoebel/n8n-nodes-propstack.git
cd n8n-nodes-propstack
npm install
npm run build
npm run lint
```

## License

[MIT](LICENSE)

<p align="center">
  <a href="https://github.com/hansdoebel/n8n-nodes-propstack">GitHub</a> |
  <a href="https://github.com/hansdoebel/n8n-nodes-propstack/issues">Issues</a> |
  <a href="https://docs.propstack.de/reference/introduction">Propstack API Docs</a>
</p>
