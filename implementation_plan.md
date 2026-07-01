# Monitoring Board Refactor

This plan outlines the refactoring of the internal operations Monitoring Board from a long vertical stacked card layout to a dense, compact summary grid featuring a detail drawer and multiple view modes, optimized for 40+ projects.

## User Review Required

> [!IMPORTANT]
> This is a major architectural UI change that will affect the primary dashboard and project detail pages. Please review the proposed components and routing structure carefully.

## Open Questions

1. **Table View columns:** Do you want specific custom data columns in the Table View, or should we stick to the ones outlined in the prompt (Project, Frequency, Period, Status, Progress, Deadline, Submitted, Focal, Last Updated)?
2. **Project Page Navigation:** For the refactored full project pages, should the historical / previous periods be listed in a simple accordion at the bottom, or kept in the main view?

## Proposed Changes

We will refactor the dashboard by creating several modular, reusable components and breaking down the heavy `MonitoringMiddlePane` and `ProjectSummaryCard`.

### Dashboard Components

#### [NEW] `components/dashboard/MonitoringBoardPage.tsx`
Will serve as the new orchestrator component for the dashboard, managing state for view modes, sorting, filtering, and the detail drawer.

#### [NEW] `components/dashboard/MonitoringTopSummary.tsx`
The top summary dashboard containing the high-level KPI cards (Total, On Time, Due Today, Due in 7 Days, Overdue, No Entry, Completed, Active Special). Clicking these will update the global filter state.

#### [NEW] `components/dashboard/MonitoringFrequencyStrip.tsx`
A horizontal scrollable strip showing project counts per frequency (Daily, Monthly, Quarterly, etc.), doubling as a quick filter.

#### [NEW] `components/dashboard/MonitoringControlBar.tsx`
A sticky bar containing search inputs, sort dropdowns, and a view mode toggle (Grid, Grouped, Table, Critical).

#### [NEW] `components/dashboard/ProjectSummaryGrid.tsx`
The default view mode rendering `CompactProjectSummaryBox` items in a responsive grid.

#### [NEW] `components/dashboard/CompactProjectSummaryBox.tsx`
Replaces `ProjectSummaryCard`. A small, dense card showing name, frequency, period, status, progress bar, deadline, focal person, and last updated time. Clicking it opens the drawer. Color-coded borders will denote status.

#### [NEW] `components/dashboard/ProjectDetailDrawer.tsx`
A slide-over modal (using Radix UI Dialog / Sheet) that displays the full details of a clicked project without leaving the dashboard.

#### [NEW] `components/dashboard/views/MonitoringGroupedView.tsx`
Renders projects grouped into collapsible sections based on their frequency.

#### [NEW] `components/dashboard/views/MonitoringTableView.tsx`
A dense data table view for power users.

#### [NEW] `components/dashboard/views/MonitoringCriticalView.tsx`
Filters projects to only show Overdue, Due Today, Due in 7 Days, No Entry, and Active Special.

### Refactored Existing Components

#### [MODIFY] `app/(app)/dashboard/page.tsx`
Will be updated to use the new `MonitoringBoardPage` structure.

#### [MODIFY] `components/dashboard/MonitoringMiddlePane.tsx`
Will be heavily dismantled and its logic moved into `MonitoringBoardPage` and child view components.

#### [DELETE] `components/dashboard/ProjectSummaryCard.tsx`
Replaced by `CompactProjectSummaryBox` and `ProjectDetailDrawer`.

### Project Page Restructuring

#### [MODIFY] `app/(app)/projects/[slug]/page.tsx`
Will be restructured. The global period selector will be removed for projects where it doesn't apply (e.g., Annual projects shouldn't show a month selector). 

#### [NEW] `components/projects/FrequencyPeriodNavigator.tsx`
A context-aware period navigator that renders the correct selector (e.g. Month picker, Year picker, Quarter picker) based on the project's specific frequency.

### Helper Logic Extensions

#### [MODIFY] `lib/period-helper.ts`
Add or update:
- `getCurrentPeriodByFrequency(frequency)`
- `getFrequencyGroup(frequency)`
- `getProjectCriticality(project)`
- `sortProjects(projects, sortMode)`

## Verification Plan

### Manual Verification
- Verify that 40+ mock projects render cleanly in the compact grid without excessive scrolling.
- Test all filter combinations (Top Summary clicks + Frequency Strip clicks + Control Bar sort/search).
- Ensure the slide-over drawer opens quickly and displays correct period data.
- Switch between Grid, Grouped, Table, and Critical views and verify data consistency.
- Navigate to a full project page and verify the period navigator correctly matches the project's frequency (e.g. Quarterly shows Q1/Q2/Q3/Q4 instead of Jan/Feb/Mar).
