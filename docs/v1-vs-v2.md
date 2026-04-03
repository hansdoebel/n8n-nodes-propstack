# Propstack Node: v1 vs v2 Comparison

The Propstack n8n node ships with two versions targeting different Propstack API generations.

- **v1** targets the stable Propstack API v1 (`/v1/`). Uses page-based pagination.
- **v2** targets the Propstack API v2 Beta (`/v2/`). Adds scroll-based pagination for large datasets (>50K records), deleted record retrieval, and several new resources.

Each version uses its own credential: v1 uses `propstackApi`, v2 uses `propstackV2Api`.

## Resource and Operation Comparison

| Resource | v1 Operations | v2 Operations |
|---|---|---|
| **Activity** | get, getAll, getActivityTypes, getReservationReasons | scroll |
| **Broker** | getAll | get, getAll, create, update |
| **Client / Contact** | create, delete, get, getAll, update *(as "Contact")* | create, delete, get, getAll, getDeleted, scroll, update *(as "Client")* |
| **Client Property / Deal** | create, delete, get, getAll, update *(as "Deal")* | create, delete, get, getAll, scroll, update *(as "Client Property")* |
| **Custom Field** | getAll | get, getAll, create, update, delete, createOption, deleteOption |
| **Deal Pipeline** | get, getAll | -- |
| **Document** | create, delete, get, getAll, update | -- |
| **Email** | get, send, update | -- |
| **Event** | getAll | -- |
| **Feature** | create, getAll, getParentFeatures | -- |
| **History** | -- | get *(messages, notes, events, tasks, deals)* |
| **Location** | getAll | -- |
| **Note** | getAll | -- |
| **Note Attachment** | -- | create |
| **Portal Export** | publish | -- |
| **Project** | create, get, getAll, update | create, delete, get, getAll, update |
| **Property** | create, delete, get, getAll, update | create, delete, get, getAll, getDeleted, getOptions, scroll, update, createLink, updateLink, deleteLink |
| **Reference Data** | -- | getAll *(property statuses, publishings, portals, client statuses, client sources, snippet categories, groups, folders, comments, message trackings, recipes, rights)* |
| **Relationship** | -- | getAll, create, delete |
| **Search Profile** | create, delete, getAll, update | -- |
| **Snippet** | getAll | getAll, create, update, delete, addAttachment |
| **Task** | create, delete, get, getAll, update | -- |
| **Team** | getAll | -- |
| **Webhook** | create, delete, getAll | -- |

## Key Differences

| Aspect | v1 | v2 |
|---|---|---|
| Credential | `propstackApi` | `propstackV2Api` |
| API base path | `/v1/` | `/v2/` |
| API status | Stable | Beta |
| Pagination parameter | `per` | `per` |
| Scroll endpoints | -- | Properties, Clients, Client Properties, Activities |
| Deleted records | -- | Properties, Clients |
| Property options | -- | Dropdown values endpoint |
| Property links | -- | Create, update, delete sub-resource |
| Custom field options | -- | Create, delete sub-resource |
| Reference data | Separate resources (locations, events, notes, etc.) | Grouped under single "Reference Data" resource |
| Contacts naming | "Contact" (`/v1/contacts`) | "Client" (`/v2/clients`) |
| Deals naming | "Deal" (`/v1/client_properties`) | "Client Property" (`/v2/client_properties`) |
| Properties endpoint | `/v1/units` | `/v2/properties` |
