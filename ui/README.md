# Frontend Entities Overview (ConnecTier)

This document provides an overview of the main entities used in the frontend of the ConnecTier project. It is intended to help frontend developers understand the system vocabulary, the purpose of each entity, and how these are exposed or referred to in the UI.

## 📦 Core Entities

### 1. **Organization**

* Represents the organization or user account that owns the data.
* This is the top-level container for all data.

### 2. **Context** (UI: **Cohort**)

* Logical grouping of entities for a specific initiative or program.
* Example: A specific incubator batch or mentorship round.
* Shown to users as **Cohorts** in the UI.

### 3. **Entity**

* Abstract concept representing anything that can be matched (e.g. a startup, a mentor, a funder, etc.).
* Each entity has:

  * A **type** (e.g. "Startup", "Mentor", etc.)
  * A **profile** (attributes that describe the entity)
* These are created at the **Organization** level and assigned to **Contexts**.

### 4. **EntityType**

* Defines a category of entity (e.g. Startup, Mentor).
* Used to group and manage attributes and display logic.

### 5. **Attribute**

* Defines the data fields associated with an entity type.
* Example: For "Startup", attributes could be "Stage", "Industry", etc.

### 6. **Match**

* Represents a system-generated or user-approved pairing between two entities.
* Each match includes metadata, such as who approved it and when.

### 7. **Message**

* Logs reasoning steps taken by the system (LLM) during the match generation process.
* These are shown in a chat-like interface, often showing the bot talking to itself.

## 📄 How These Appear in the UI

| Backend Entity | UI Label                          | Description                                                  |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| Context        | Cohort                            | Represents a group of startups (or other entities)           |
| Entity         | Entity (or Startup, Mentor, etc.) | User-facing based on type                                    |
| Attribute      | Profile Fields                    | Shown in forms, cards, and detail views                      |
| Match          | Match                             | Shown in match result lists and approval flows               |
| Message        | Chat Log                          | Shown in a reasoning/explanation view (e.g. expandable chat) |

## 🧠 Notes for Development

* Always use the UI terms when referring to entities in user-facing components.
* Keep type-specific logic abstracted via `EntityType` wherever possible.
* When in doubt, check the backend API response shape or ask a team member.

---

Let this document evolve as more entities or renames happen in the system!
