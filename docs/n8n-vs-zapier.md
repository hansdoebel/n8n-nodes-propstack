# Propstack: n8n Community Node vs Zapier Integration

Comparison of the Propstack n8n community node (v1 + v2) against the official Zapier integration (v1.4.0).

## Triggers

| Event | n8n (Webhook) | Zapier |
|---|---|---|
| Client Created | ✓ | ✓ (Instant) |
| Client Updated | ✓ (also fires on delete) | ✓ (Instant) |
| Client Deleted | -- | ✓ (Polling) |
| Client Property Created | ✓ | -- |
| Client Property Updated | ✓ | -- |
| Client Property Deleted | ✓ | -- |
| Document Created | ✓ | -- |
| Document Updated | ✓ | -- |
| Document Deleted | ✓ | -- |
| Project Created | ✓ | -- |
| Project Updated | ✓ | -- |
| Property Created | ✓ | ✓ (Instant) |
| Property Updated | ✓ | ✓ (Instant) |
| Saved Query Created | ✓ | -- |
| Saved Query Updated | ✓ | -- |
| Saved Query Deleted | ✓ | -- |
| Task Created | ✓ | -- |
| Task Updated | ✓ | -- |
| Task Deleted | ✓ | -- |
| **Total** | **18** | **5** |

n8n triggers are all webhook-based (instant). Zapier uses webhooks for most triggers but falls back to polling for client deletion.

## Actions

| Category | Operation | n8n v1 | n8n v2 | Zapier |
|---|---|---|---|---|
| **Activity** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| | getActivityTypes | ✓ | -- | -- |
| | getReservationReasons | ✓ | -- | -- |
| | scroll | -- | ✓ | -- |
| **Broker** | get | -- | ✓ | -- |
| | getAll | ✓ | ✓ | -- |
| | create | -- | ✓ | -- |
| | update | -- | ✓ | -- |
| **Contact / Client** | get | ✓ | ✓ | ✓ |
| | getAll | ✓ | ✓ | -- |
| | create | ✓ | ✓ | ✓ |
| | update | ✓ | ✓ | -- |
| | delete | ✓ | ✓ | -- |
| | getDeleted | -- | ✓ | -- |
| | scroll | -- | ✓ | -- |
| **Client Property / Deal** | get | ✓ | ✓ | -- |
| | getAll | ✓ | ✓ | -- |
| | create | ✓ | ✓ | ✓ |
| | update | ✓ | ✓ | -- |
| | delete | ✓ | ✓ | -- |
| | scroll | -- | ✓ | -- |
| **Custom Field** | get | -- | ✓ | -- |
| | getAll | ✓ | ✓ | -- |
| | create | -- | ✓ | -- |
| | update | -- | ✓ | -- |
| | delete | -- | ✓ | -- |
| | createOption | -- | ✓ | -- |
| | deleteOption | -- | ✓ | -- |
| **Deal Pipeline** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| **Document** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| | create | ✓ | -- | -- |
| | update | ✓ | -- | -- |
| | delete | ✓ | -- | -- |
| **Email** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| | send | ✓ | -- | -- |
| | update | ✓ | -- | -- |
| **Event** | getAll | ✓ | -- | ✓ |
| **Feature** | getAll | ✓ | -- | -- |
| | create | ✓ | -- | -- |
| | getParentFeatures | ✓ | -- | -- |
| **History** | get | -- | ✓ | -- |
| **Location** | getAll | ✓ | -- | -- |
| **Note** | getAll | ✓ | -- | -- |
| | create | -- | -- | ✓ |
| **Note Attachment** | create | -- | ✓ | -- |
| **Portal Export** | publish | ✓ | -- | -- |
| **Project** | get | ✓ | ✓ | -- |
| | getAll | ✓ | ✓ | -- |
| | create | ✓ | ✓ | -- |
| | update | ✓ | ✓ | -- |
| | delete | ✓ | ✓ | -- |
| **Property** | get | ✓ | ✓ | ✓ |
| | getAll | ✓ | ✓ | -- |
| | create | ✓ | ✓ | -- |
| | update | ✓ | ✓ | -- |
| | delete | ✓ | ✓ | -- |
| | getDeleted | -- | ✓ | -- |
| | getOptions | -- | ✓ | -- |
| | scroll | -- | ✓ | -- |
| | createLink | -- | ✓ | -- |
| | updateLink | -- | ✓ | -- |
| | deleteLink | -- | ✓ | -- |
| **Reference Data** | getAll | -- | ✓ | -- |
| **Relationship** | getAll | -- | ✓ | -- |
| | create | -- | ✓ | -- |
| | delete | -- | ✓ | -- |
| **Search Profile** | getAll | ✓ | -- | -- |
| | create | ✓ | -- | -- |
| | update | ✓ | -- | -- |
| | delete | ✓ | -- | -- |
| **Snippet** | getAll | -- | ✓ | -- |
| | create | -- | ✓ | -- |
| | update | -- | ✓ | -- |
| | delete | -- | ✓ | -- |
| | addAttachment | -- | ✓ | -- |
| **Task** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| | create | ✓ | -- | ✓ |
| | update | ✓ | -- | -- |
| | delete | ✓ | -- | -- |
| **Team** | get | ✓ | -- | -- |
| | getAll | ✓ | -- | -- |
| | create | ✓ | -- | -- |
| | update | ✓ | -- | -- |
| | delete | ✓ | -- | -- |
| **Webhook** | getAll | ✓ | -- | -- |
| | create | ✓ | -- | -- |
| | delete | ✓ | -- | -- |

Zapier also offers two operations not directly mapped to a single resource:

- **Newsletter Subscribe** -- sets "Newsletter gewuenscht" to "ja" on a contact by email
- **Newsletter Unsubscribe** -- sets "Newsletter gewuenscht" to "nein" on a contact by email

## Summary

| Metric | n8n (v1 + v2 combined) | Zapier |
|---|---|---|
| Trigger events | 18 | 5 |
| Resources | 19 | 6 |
| Total operations | 80+ | 9 |
| API versions | v1 (stable), v2 (beta) | v1 only |
| Scroll pagination | ✓ (v2) | -- |
| Deleted record retrieval | ✓ (v2) | -- |
| Custom field management | ✓ (v2) | -- |
| Self-hosted option | ✓ | -- |
