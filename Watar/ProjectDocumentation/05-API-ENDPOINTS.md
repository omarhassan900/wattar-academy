# API Endpoints Reference

All endpoints are defined in `server.js`. Most return JSON for AJAX calls, some render EJS pages.

## Authentication

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/login` | No | — | Login page |
| POST | `/login` | No | — | Process login (username + password) |
| GET | `/logout` | Yes | Any | Destroy session, redirect to login |
| GET | `/` | Yes | Any | Home redirect based on role |

## Dashboard

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/dashboard` | Yes | manager | Dashboard with stats and charts |

## Students

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/students` | Yes | manager, reception, ops_manager | List students page |
| POST | `/students` | Yes | manager, reception, ops_manager | Add new student |
| GET | `/students/:id` | Yes | manager, reception, ops_manager | Get student JSON |
| POST | `/students/:id/edit` | Yes | manager, reception, ops_manager | Edit student |
| POST | `/students/:id` | Yes | manager, reception, ops_manager | Update student (API) |

## Classes

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/classes` | Yes | manager | List classes page |
| POST | `/classes` | Yes | manager | Add new class |

## Attendance

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/attendance` | Yes | manager, reception, ops_manager | Attendance page |
| POST | `/attendance/save-all` | Yes | manager, reception | Save all attendance |
| POST | `/attendance/session` | Yes | manager, reception | Save single session |
| POST | `/attendance/session-save` | Yes | manager, reception | Save session by number |
| POST | `/attendance/all` | Yes | manager, reception | Save attendance + notes |
| POST | `/attendance/clear` | Yes | manager, reception | Clear attendance record |
| GET | `/attendance/export-csv` | Yes | manager, reception | Export CSV |
| GET | `/attendance/summary` | Yes | manager | Summary by level |
| POST | `/api/update-student-month` | Yes | manager, reception | Update student level |
| POST | `/api/session-date` | Yes | manager, reception | Set session date |
| GET | `/api/sessions` | Yes | Any auth | Get sessions for a level |

## Weekly Schedule

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/pre-schedule` | Yes | manager, ops_manager, reception, trainer | Schedule page |
| GET | `/pre-schedule/list` | Yes | manager, ops_manager, reception, trainer | Get all entries (JSON) |
| POST | `/pre-schedule/add` | Yes | manager, ops_manager | Add to schedule |
| POST | `/pre-schedule/update` | Yes | manager, ops_manager | Update entry |
| POST | `/pre-schedule/delete` | Yes | manager, ops_manager | Soft-delete entry |
| GET | `/pre-schedule/unscheduled` | Yes | manager, ops_manager, reception, trainer | Unscheduled students |

## Session Confirmations

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/session-confirmations` | Yes | manager, ops_manager | Confirmations page |
| POST | `/session-confirmations/update` | Yes | manager, ops_manager | Update status |
| GET | `/session-confirmations/list` | Yes | manager, ops_manager | Get all (JSON) |

## Cash Management

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/cash` | Yes | manager, reception | Transactions page |
| POST | `/cash` | Yes | manager, reception | Add transaction |
| POST | `/cash/:id/edit` | Yes | manager, reception | Edit transaction |
| POST | `/cash/:id/delete` | Yes | manager | Delete transaction |

## Leads / Sales

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/leads` | Yes | sales, manager, ops_manager, reception | Leads page |
| POST | `/leads/add` | Yes | sales, manager, ops_manager | Add lead |
| POST | `/leads/:id/update` | Yes | sales, manager, ops_manager | Update lead |
| POST | `/leads/:id/delete` | Yes | manager, ops_manager | Delete lead |
| POST | `/leads/:id/call` | Yes | sales, manager, ops_manager | Log call |
| GET | `/leads/:id/calls` | Yes | sales, manager, ops_manager, reception | Call history |
| POST | `/leads/:id/schedule-trial` | Yes | manager, ops_manager | Schedule trial |
| POST | `/leads/:id/trial-result` | Yes | reception, manager, ops_manager | Mark trial result |

## Band

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/band` | Yes | manager, ops_manager, reception | Band page |
| POST | `/band/add-member` | Yes | manager, ops_manager, reception | Add member |
| POST | `/band/remove-member` | Yes | manager, ops_manager | Remove member |
| POST | `/band/save-attendance` | Yes | manager, ops_manager, reception | Save attendance |
| POST | `/band/clear-attendance` | Yes | manager, ops_manager | Clear attendance |
| POST | `/band/next-cycle` | Yes | manager, ops_manager | Next cycle |
| POST | `/band/prev-cycle` | Yes | manager, ops_manager | Previous cycle |

## Evaluations

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/evaluations` | Yes | manager, ops_manager, reception, trainer | Evaluations page |
| POST | `/evaluations/save` | Yes | manager, ops_manager, reception, trainer | Save evaluation |
| GET | `/evaluations/history/:studentId` | Yes | manager, ops_manager, reception, trainer | History |

## Student Feedback

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/student-feedback/generate-link` | Yes | manager, reception | Generate token |
| POST | `/student-feedback/save` | Yes | manager, reception | Save feedback |
| GET | `/student-feedback/list` | Yes | manager, reception | List all feedback |
| GET | `/feedback/:token` | No | Public | Public feedback form |
| POST | `/feedback/:token/submit` | No | Public | Submit feedback |

## User Management

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/users` | Yes | manager | Users page |
| POST | `/users` | Yes | manager | Add user |
| POST | `/users/:id/edit` | Yes | manager | Edit user |
| POST | `/users/:id/delete` | Yes | manager | Delete user |

## Reports

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/reports` | Yes | manager | Reports page |

## Admin

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/admin/db` | Yes | manager | DB admin page |
| POST | `/admin/db/query` | Yes | manager | Execute SQL query |
