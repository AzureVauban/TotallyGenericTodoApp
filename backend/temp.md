### `backend/` Notes – _DivideNDo_

#### Purpose

This folder will house the backend logic and services for the DivideNDo app. It will handle:

- User data
- Chore creation and assignment
- Group membership
- Leaderboard calculation
- Real-time updates (eventually)

---

#### Initial Tasks

- [ ] Set up basic API routes or serverless functions
- [ ] Create models for:
  - User
  - Group
  - Chore
  - Scoreboard/Leaderboard
- [ ] Define auth structure (JWT, session, or external)

---

#### Backend Options to Research

- [ ] **Firebase**

  - Realtime Database vs. Firestore
  - Firebase Auth
  - Cloud Functions
  - Integration with Expo

- [ ] **Supabase**
  - Postgres DB + RESTful/GraphQL API
  - Row-level security for groups
  - Supabase Auth
  - Expo compatibility (via Supabase client)

---

#### Future Considerations

- [ ] Chore recurrence support
- [ ] Chore reminders (push/email)
- [ ] Analytics on chore completion trends
- [ ] Admin dashboard for group oversight

---
