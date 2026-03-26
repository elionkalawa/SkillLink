# SkillLink – Project Documentation

SkillLink: A SaaS platform connecting skilled users to projects and collaborators, helping them build portfolios and grow professionally.

## Table of Contents
- [Project Overview](#1-project-overview)
- [Core Features](#2-core-features)
- [Modules / Components](#3-modules--components)
- [Data Models](#4-data-models)
- [Workflows / User Flows](#5-workflows--user-flows)
- [API Endpoints](#6-api-endpoints)
- [UI & UX Notes](#7-ui--ux-notes)
- [Tech Stack](#8-tech-stack)
- [Future Enhancements](#9-future-enhancements)

## 1. Project Overview

SkillLink is designed to help users:
- Showcase their skills
- Discover and join relevant projects
- Collaborate with other professionals
- Build a professional portfolio

**Vision:** Turn skills into real-world opportunities through collaboration and discovery.

**Audience:** Developers, designers, students, and professionals looking for real project experience.

## 2. Core Features

| Feature | Description | Notes |
| :--- | :--- | :--- |
| **User Profiles** | Each user has a profile with name, bio, skills, portfolio, and experience level | Users can update skills anytime |
| **Project Discovery** | Browse available projects by skill, category, and role | Supports search and filtering |
| **Project Creation** | Users can create projects specifying roles, skills needed, and description | Can set max team size |
| **Collaboration** | Users can request to join projects; project owners can approve/reject | Team management system |
| **Portfolio** | Users can showcase completed projects | Automatically updates from joined/completed projects |
| **Skill Matching** | Platform recommends projects and collaborators based on user skills | AI matching optional in future |
| **Messaging** | Users can chat within projects | Comment-based initially, chat later |
| **Notifications** | Email and in-app notifications for invites, approvals, and project updates | Optional push notifications in future |
| **Dashboard** | Overview of user’s projects, invitations, and portfolio | Personalized summary |

## 3. Modules / Components

### 3.1 Authentication
**Purpose:** Manage login, registration, and session (via NextAuth + JWT).
**Components:**
- `AuthForm` – reusable login/register form
- `OAuthButton` – Google login
**Notes:** Handles both email/password and OAuth login.

### 3.2 User Profile
**Purpose:** Display and update user info
**Components:**
- `ProfileCard` – shows name, bio, skills
- `PortfolioList` – shows completed projects
**Functions:** Update skills, bio, upload portfolio items.

### 3.3 Projects
**Purpose:** Creation, discovery, joining, and collaboration
**Components:**
- `ProjectCard` – overview of project
- `ProjectDetail` – full project info, team members, join button
- `ProjectForm` – create or edit project
**Functions:** Search, filter, join, leave, manage team.

### 3.4 Collaboration & Team Management
**Purpose:** Manage project team and member roles
**Components:**
- `TeamList` – shows members and roles
- `MemberInvite` – invite new members
**Functions:** Approve/reject members, assign roles.

### 3.5 Dashboard
**Purpose:** Central hub for user activity
**Components:**
- `DashboardSummary` – upcoming projects, invitations, completed projects
- `Notifications` – recent updates and messages
**Functions:** Quick access to projects, portfolio, messages.

## 4. Data Models

### 4.1 User
| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary key |
| name | string | Full name |
| email | string | Unique |
| username | string | Unique, handle |
| bio | text | Optional |
| skills | string[] | Array of skills |
| image | string | Profile image URL |
| created_at | timestamp | Account creation date |

### 4.2 Project
| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary key |
| title | string | Project title |
| description | text | Full description |
| owner_id | UUID | References User.id |
| skills_required | string[] | Skills needed |
| max_team_size | integer | Max team members |
| status | enum | `['open','in-progress','completed']` |
| created_at | timestamp | Date of creation |

### 4.3 ProjectMember
| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary key |
| project_id | UUID | References Project.id |
| user_id | UUID | References User.id |
| role | enum | `['owner','member','guest']` |
| status | enum | `['pending','approved','rejected']` |
| joined_at | timestamp | Date user joined |

### 4.4 Notification
| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID | Primary key |
| user_id | UUID | Recipient user |
| type | enum | `['invite','approval','message','project-update']` |
| message | text | Notification message |
| read | boolean | Default false |
| created_at | timestamp | Date created |

## 5. Workflows / User Flows

### 5.1 User Registration / Login
1. User visits `/register`
2. Creates account via credentials or OAuth
3. Session JWT created
4. Redirect to `/dashboard`

### 5.2 Project Discovery
1. User visits `/dashboard` or `/projects`
2. Filters projects by skills or category
3. Clicks project → views details
4. Requests to join project

### 5.3 Project Collaboration
1. Owner approves/rejects members
2. Members participate and update progress
3. Completed projects automatically update user portfolios

## 6. API Endpoints (Next.js / App Router)

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/projects` | GET | List all projects |
| `/api/projects` | POST | Create a project |
| `/api/projects/:id` | GET | Get project details |
| `/api/projects/:id/join` | POST | Request to join project |
| `/api/projects/:id/members` | PATCH | Approve/reject members |
| `/api/users/:id` | GET | Get user profile |
| `/api/users/:id` | PATCH | Update user profile |
| `/api/notifications` | GET | Fetch notifications |

## 7. UI & UX Notes
- Modern Clerk-style auth UI
- Responsive design with Tailwind
- Soft shadows, rounded corners, hover/focus animations
- Dashboard with summary cards
- Project cards for quick info at a glance

## 8. Tech Stack
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Authentication:** NextAuth.js (JWT)
- **Database:** Supabase (PostgreSQL)
- **Password Hashing:** bcrypt
- **Hosting:** Vercel / Node.js environment

## 9. Future Enhancements
- AI-based skill matching and recommendations
- Real-time messaging / chat system
- Notifications via email or push
- Analytics dashboard for user progress
- Gamification badges for completed projects
