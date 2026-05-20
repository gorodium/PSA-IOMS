# Integrated Operations Monitoring System (IOMS)

IOMS is a Phase 1 internal web system for monitoring government statistical office projects. It is designed to replace a Google Sheet monitoring board with a cleaner, more secure, and more maintainable dashboard.

This first version focuses only on project monitoring. It includes login, roles, project dashboards, personnel records, project details, task progress updates, remarks, audit logs, and seed data.

## What This App Does

IOMS helps an office monitor active statistical projects by showing:

- how many projects are active;
- which projects are completed, overdue, due soon, or on track;
- which tasks need attention;
- who is assigned to each project;
- project cycles, deadlines, progress, remarks, and audit history.

The system is intentionally limited to Phase 1. It is not yet a full operations management system.

## Phase 1 Scope

Included in Phase 1:

- Email and password login.
- Public read-only access to the dashboard, project list, and project detail pages.
- Password hashing with `bcryptjs`.
- Secure HTTP-only cookie sessions.
- Protected internal pages.
- Role-based access control.
- Project dashboard with KPI cards.
- Skynet-inspired dark command-center dashboard layout.
- Current date display on the dashboard.
- Upcoming nearest deadline display on the dashboard.
- Project status chart.
- Needs Attention table.
- Project list with search and filters.
- Project detail page.
- Add and edit project forms.
- Per-project data section toggles for the Google Sheet monitoring fields.
- Editable task/deadline table rows and column labels.
- Super Admin settings for admin accounts and project edit assignment.
- Project remarks.
- Personnel list with add and edit forms.
- Admin overview page.
- Audit log table.
- Prisma database schema.
- PostgreSQL database support.
- Seed data for testing and demonstration.
- Unit tests for status calculation logic.

Not included in Phase 1:

- Vehicle scheduling.
- Convocation assignment.
- Full Gantt charts.
- PDF exports.
- Email notifications.
- Full user management screens.

## Tech Stack

The project uses:

- `Next.js App Router` for the web application.
- `TypeScript` for type safety.
- `Tailwind CSS` for styling.
- `shadcn/ui-style components` for reusable UI elements.
- `Prisma` as the database ORM.
- `PostgreSQL` as the database.
- `Zod` for form and input validation.
- `bcryptjs` for password hashing.
- `lucide-react` for icons.
- `date-fns` for date handling.
- `Recharts` for simple dashboard charts.
- `Vitest` for unit tests.

## Main Pages

### `/login`

Login page for email and password authentication.

Default seeded login:

- Email: `admin@ioms.local`
- Password: `Admin12345!`

### `/dashboard`

Main monitoring dashboard. This page can be viewed without logging in. It shows:

- total active projects;
- completed projects;
- overdue projects;
- due soon projects;
- projects not updated recently;
- total active personnel;
- project status chart;
- Needs Attention table;
- current date at the bottom right;
- upcoming nearest project deadline.

### `/projects`

Project list page. It includes:

- search by project name;
- filter by status;
- filter by category;
- filter by year;
- filter by personnel;
- filter by active or inactive state;
- project progress and status badges.
- nearest deadline and last update date.

### `/projects/[id]`

Project detail page. This page can be viewed without logging in, but edit controls are hidden unless the user has access. It shows:

- project information;
- focal person;
- assigned personnel;
- project cycles;
- task and deadline table;
- Google Sheet monitoring data sections;
- progress;
- remarks;
- audit history.

Authorized users can also update tasks and add remarks.

### `/projects/new`

Create a new project.

### `/projects/[id]/edit`

Edit an existing project.

### `/personnel`

Personnel list and add/edit form.

### `/admin`

Basic admin landing page with links and seed data information.

### `/admin/audit-logs`

Audit log table showing recent activity.

### `/settings`

Super Admin settings page. It allows the Super Admin to:

- add admin accounts;
- disable admin accounts;
- check which projects each admin can edit.

## User Roles

The app defines these roles:

- `SUPER_ADMIN`
- `ADMIN`
- `SUPERVISOR`
- `EMPLOYEE`
- `VIEWER`

Permissions are centralized in:

```text
lib/permissions.ts
```

The app uses:

```ts
checkUserPermission(user, action, resource)
```

This keeps permission rules out of page and component code.

## Role Summary

`SUPER_ADMIN`

- Can do everything.
- Can add and disable admin accounts.
- Can assign admins to edit specific projects.

`ADMIN`

- Can view public monitoring pages.
- Can edit only the project pages assigned in Settings.

`SUPERVISOR`

- Can view dashboards and records.
- Can update projects and tasks under supervision.
- Can add remarks.

`EMPLOYEE`

- Can view the dashboard and project records.
- Can update assigned task information.
- Can add remarks.

`VIEWER`

- Can only view allowed pages and records.

## Project Status Rules

Status logic is centralized in:

```text
lib/status.ts
```

The main functions are:

```ts
calculateTaskStatus(task, today)
calculateProjectCycleStatus(cycle, tasks, today)
calculateProjectProgress(cyclesOrTasks)
calculateDueSoon(deadline, today)
```

Status meanings:

- `COMPLETED`: the item has a submitted date or progress is 100.
- `OVERDUE`: the deadline is before today and the item is not completed.
- `DUE_TODAY`: the deadline is today and the item is not completed.
- `DUE_SOON`: the deadline is within the next 7 days and the item is not completed.
- `ON_TRACK`: the deadline is more than 7 days away and the item is not completed.
- `NO_DEADLINE`: no deadline is set.
- `INACTIVE`: the project, cycle, or task is inactive.

## Project Structure

Important folders and files:

```text
app/
  login/
    page.tsx
    actions.ts
  (app)/
    layout.tsx
    dashboard/
    projects/
    personnel/
    admin/

components/
  dashboard/
  layout/
  personnel/
  projects/
  ui/

lib/
  audit.ts
  auth.ts
  db.ts
  format.ts
  permissions.ts
  project-metrics.ts
  status.ts
  validators.ts

prisma/
  schema.prisma
  seed.ts
```

### Important Files

`lib/db.ts`

- Exports the reusable Prisma client.

`lib/auth.ts`

- Handles password hashing.
- Handles password comparison.
- Handles session cookie creation.
- Retrieves the current user.

`lib/permissions.ts`

- Contains role-based permission rules.

`lib/status.ts`

- Contains deadline, progress, and status business rules.

`lib/validators.ts`

- Contains Zod validation schemas for login, projects, personnel, tasks, and remarks.

`lib/audit.ts`

- Writes audit log records.

`prisma/schema.prisma`

- Defines the database models and enums.

`prisma/seed.ts`

- Creates the default admin account.
- Creates sample personnel.
- Creates sample projects, cycles, tasks, remarks, and audit data.

## Database Models

The Prisma schema includes:

- `User`
- `Personnel`
- `Project`
- `ProjectPersonnel`
- `ProjectCycle`
- `ProjectTask`
- `ProjectRemark`
- `AuditLog`

It also includes enums for:

- `UserRole`
- `ProjectCategory`
- `ProjectFrequency`
- `ProjectPriority`
- `ProjectStatus`
- `TaskStatus`

Most records use soft-disable behavior with `isActive`. Normal app actions should not permanently delete records.

## Project Categories

Projects use only these four main categories:

- Statistical Operations
- Civil Registration and Vital Statistics
- Philippine Identification System
- Administrative and Accounting Reports

Statistical Operations also supports these subcategories:

- Household Surveys
- Census, Sampling Frames, and Community-Based Monitoring System
- Establishment Surveys
- Administrative Data
- Statistical Framework and Indicators System
- Provincial Product Accounts

## Requirements Before Running

Install these first:

- Node.js
- npm
- PostgreSQL

You also need a PostgreSQL database named:

```text
ioms
```

Example PostgreSQL connection string:

```text
postgresql://postgres:password@localhost:5432/ioms
```

Change the username, password, host, port, and database name if your local PostgreSQL setup is different.

## Environment Setup

Create a local `.env` file from the example:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ioms"
SESSION_SECRET="replace-with-secure-random-string"
```

Use a long random value for `SESSION_SECRET`, especially outside local development.

Do not commit your real `.env` file.

## First-Time Setup

From the project folder:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run the initial database migration:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The app will redirect you to `/login` if you are not signed in.

## Default Admin Account

After seeding, use:

```text
Email:    admin@ioms.local
Password: Admin12345!
```

This account has the `SUPER_ADMIN` role.

## Useful Commands

Install packages:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server after build:

```bash
npm run start
```

Run lint checks:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Generate Prisma client:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
npx prisma db seed
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Verification Checklist

After setup, verify these items:

- Visiting `/dashboard` while logged out is allowed.
- Visiting `/projects` while logged out is allowed.
- Visiting `/projects/[id]` while logged out is allowed.
- Visiting `/personnel` while logged out redirects to `/login`.
- Visiting `/admin` while logged out redirects to `/login`.
- Logging in with the default admin account redirects to `/dashboard`.
- `/dashboard` shows KPI cards.
- `/dashboard` shows the project status chart.
- `/dashboard` shows the Needs Attention table.
- `/dashboard` shows the current date at the bottom right.
- `/dashboard` shows the upcoming nearest project deadline.
- `/projects` shows seeded projects.
- Project filters work by status, category, year, personnel, and active state.
- Project search works by project name.
- `/projects/new` allows authorized users to create a project.
- `/projects/[id]` shows project information, personnel, cycles, tasks, remarks, and audit history.
- `/projects/[id]` hides edit controls for public viewers.
- Authorized users can update task progress and dates.
- Assigned admins can edit only checked projects from `/settings`.
- Super Admin can add and disable admins from `/settings`.
- Authorized users can add remarks.
- `/personnel` shows seeded personnel.
- Authorized users can add and edit personnel.
- `/admin/audit-logs` shows audit records.

## Automated Checks

Run:

```bash
npx prisma generate
npm run lint
npm run build
npm run test
```

If PostgreSQL is running and your `.env` is correct, also run:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Seed Data

The seed file creates:

- one `SUPER_ADMIN` user;
- 10 sample personnel records;
- 10 sample projects;
- project assignments;
- project cycles;
- tasks with mixed statuses;
- initial remarks;
- an audit log entry.

Sample seeded projects:

- Labor Force Survey
- Consumer Price Index
- Family Income and Expenditure Survey
- Annual Survey of Philippine Business and Industry
- Mapping Activities
- Foreign Trade Statistics
- Building Permits
- PHILSYS
- Administrative Reports
- Accounting Reports

The seed data is for development and demonstration only.

## Common Workflow

1. Sign in as the default admin.
2. Review `/dashboard` for overall status.
3. Open `/projects` to search or filter projects.
4. Open a project detail page to review cycles, tasks, remarks, and audit history.
5. Update task progress or submitted dates when work changes.
6. Add remarks to record monitoring updates.
7. Use `/personnel` to maintain staff records.
8. Use `/admin/audit-logs` to review recorded actions.

## Troubleshooting

### Prisma cannot connect to PostgreSQL

Check that PostgreSQL is running.

Then confirm `.env` has the correct connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ioms"
```

Also confirm that the `ioms` database exists.

### Migration fails because the database does not exist

Create the database first in PostgreSQL, then rerun:

```bash
npx prisma migrate dev --name init
```

### Seed fails with "Can't reach database server"

PostgreSQL is not reachable at the host and port in `DATABASE_URL`.

Start PostgreSQL or update `DATABASE_URL`.

### Login does not work

Rerun the seed command:

```bash
npx prisma db seed
```

Then use:

```text
admin@ioms.local
Admin12345!
```

### Build fails after changing Prisma schema

Regenerate Prisma Client:

```bash
npx prisma generate
```

Then rebuild:

```bash
npm run build
```

### Browser stays on login after signing in

Check that:

- `SESSION_SECRET` is set;
- browser cookies are enabled;
- the app is running on the same host you are opening in the browser.

### Production cookies do not persist

In production, secure cookies require HTTPS. Make sure the app is served over HTTPS and `SESSION_SECRET` is configured.

## Notes for Future Phases

Future phases can add:

- full user management;
- stronger assignment rules for supervisors and employees;
- vehicle scheduling;
- convocation assignment;
- full Gantt charts;
- PDF exports;
- email notifications;
- more detailed reporting and analytics.

Keep business rules in `lib/` utilities instead of placing them directly inside React components.
