# Instructor / Mentor Dashboard Buttons in Profile Dropdown

**Date:** 2026-06-08

## Goal

Add two role-gated buttons to the profile/logout dropdown that appears on both
the quiz screens and the results pages. The buttons link Scaler instructors and
mentors to their respective dashboards.

## Context

- The dropdown is rendered by a single shared component, `UserDropdown`, in
  `frontend/src/components/NavigationBar.js`. It is consumed by the quiz screens
  (`FinalModeQuiz.js`, `MBAQuiz.js`) and by the results pages (via
  `NavigationBar`). Editing this one component covers every surface.
- User data comes from `GET /api/v3/users`. The response `attributes` flow into
  the `$initialData` nanostore (`frontend/src/store/initial-data.js`) and are
  exposed in `UserDropdown` as `userData`. The response includes the boolean
  keys `is_instructor` and `is_mentor`.

## Requirements

1. If `userData.is_instructor === true`, show an **Instructor** button.
   On click, navigate (same tab) to
   `https://www.scaler.com/academy/instructor-dashboard/`.
2. If `userData.is_mentor === true`, show a **Mentor** button.
   On click, navigate (same tab) to
   `https://www.scaler.com/academy/mentor-dashboard/`.
3. Use strict `=== true` checks so buttons only appear when the key is present
   and truthy. A user may have both, one, or neither.
4. Buttons appear above the existing Logout button in the dropdown menu.

## Design Decisions

- **Labels:** "Instructor" and "Mentor".
- **Navigation:** same tab, via `window.location.href`, matching the Logout
  redirect pattern.
- **Style:** new `DashboardLinkButton` styled-component — neutral dark text
  (`#1e293b`), light gray hover (`#f8fafc`) — visually distinct from the pink
  destructive Logout button. Same layout/padding/font as `LogoutButton`.
- **Icons:** phosphor icons matching the existing icon + label pattern
  (`Chalkboard` for instructor, `Users` for mentor).
- **Analytics:** each click fires a `tracker.click` event mirroring the logout
  tracking (`click_type`, `click_source: 'navbar'`).

## Out of Scope

- No backend changes; the API already returns the flags.
- No new tests — small conditional render in a presentational component with no
  existing `UserDropdown` test coverage. Verify via build / visual check.
