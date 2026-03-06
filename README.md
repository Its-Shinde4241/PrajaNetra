# Prajanetra

> A civic complaint management platform that connects citizens with municipal authorities to report, track, and resolve local issues.

**Live Demo:** [Deployed Project]()

---

## Overview

Prajanetra allows citizens to file geo-tagged complaints with photo evidence, track resolution status in real time, and engage through a public feed. Municipal staff and admins get a dashboard to manage complaints, update statuses, and analyse trends.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Zustand |
| Backend | Spring Boot 3, Java |
| Auth | JWT + Google OAuth2 |
| Database | MySQL (TiDB) |
| Storage | Supabase Storage |

---

## Features

- **Citizens** — File complaints with images & location, track status, like/save posts
- **Feed** — Public complaint feed with filtering, sorting, and comments
- **Admin** — Dashboard with analytics, bulk actions, user & complaint management
- **Auth** — Email/password login and Google OAuth2

---

## Project Structure

```
Prajanetra/
├── PrajanetraClient/   # React + Vite frontend
└── PrajanetraServer/   # Spring Boot backend
```

---

## Getting Started

### Frontend
```bash
cd PrajanetraClient
npm install
npm run dev
```

### Backend
```bash
cd PrajanetraServer
./mvnw spring-boot:run
```

Set the required environment variables in `application.properties` (DB URL, JWT secret, OAuth credentials, Supabase keys).

---

## Architecture

### Frontend

```mermaid
flowchart TB
    subgraph subGraph0["Frontend Layer - React + TypeScript + Vite"]
        A["React App"]

        B["Auth Pages"]
        B1["Login"]
        B2["Signup"]
        B3["OAuthCallback"]

        C["Citizen Pages"]
        C1["FileComplaint"]
        C2["TrackComplaint"]
        C3["Profile"]
        C4["MyAllComplaints"]

        D["Admin Pages"]
        D1["AdminDashboard"]
        D2["ComplaintsManagement"]
        D3["UserManagement"]

        E["Feed System"]
        E1["FeedPage"]
        E2["CommentsSheet"]
        E3["ComplaintCard"]

        A --> B & C & D & E
        B --> B1 & B2 & B3
        C --> C1 & C2 & C3 & C4
        D --> D1 & D2 & D3
        E --> E1 & E2 & E3
    end

    subgraph subGraph1["State Management - Zustand"]
        ST1["userStore"]
        ST2["complaintStore"]
        ST3["FeedStore"]
        ST4["adminStore"]
        ST5["commentsStore"]
    end

    subgraph subGraph2["API Layer"]
        LB1["axios.ts - API Client"]
        EX3["Spring Boot API"]
    end

    B1 & B2 & B3 --> ST1
    C1 & C2 & C3 & C4 --> ST2
    E1 & E2 & E3 --> ST3
    D1 & D2 & D3 --> ST4
    E2 --> ST5

    ST1 & ST2 & ST3 & ST4 & ST5 --> LB1
    LB1 --> EX3

    style A fill:#61dafb,color:#000
    style ST1 fill:#ff6b35,color:#fff
    style ST2 fill:#ff6b35,color:#fff
    style ST3 fill:#ff6b35,color:#fff
    style ST4 fill:#ff6b35,color:#fff
    style ST5 fill:#ff6b35,color:#fff
    style LB1 fill:#61dafb,color:#000
    style EX3 fill:#6db33f,color:#fff
```

### Backend

```mermaid
---
config:
  layout: dagre
  theme: default
  look: classic
---
flowchart TB
    subgraph subGraph0["Client"]
        CL["React Frontend\naxios + JWT Bearer"]
    end
    subgraph subGraph1["Auth Module"]
        SF["JwtAuthFilter"]
        OH["OAuth2SuccessHandler"]
        RB["USER / STAFF / ADMIN"]
        SV6["JwtService"]
        G["Google OAuth2"]
    end
    subgraph subGraph2["Controllers"]
        AC["AuthController"]
        CC["ComplaintController"]
        FC["FeedController"]
        CMC["CommentsController"]
        ADC["AdminController"]
        UPC["UserProfileController"]
    end
    subgraph subGraph3["Services"]
        SV1["UserService"]
        SV2["ComplaintService"]
        SV3["FeedService"]
        SV4["CommentService"]
        SV5["AdminService"]
        SV7["FileStorageService"]
    end
    subgraph subGraph4["Repositories"]
        R1["UserRepo"]
        R2["ComplaintRepo"]
        R3["CommentRepo"]
    end
    subgraph subGraph5["Models"]
        M1["User"]
        M2["Complaint"]
        M3["Comment"]
    end
    subgraph subGraph6["Database - MySQL"]
        T1[("TIDB_DATABASE")]
    end
    subgraph subGraph7["External"]
        SB["Supabase Storage"]
    end
    CL --> SF
    SF --> RB & SV6
    G --> OH
    OH --> SV6 & AC
    RB --> AC & CC & FC & CMC & ADC & UPC
    AC --> G & SV1
    CC --> SV2 & SV7
    FC --> SV3
    CMC --> SV4
    ADC --> SV5
    UPC --> SV3
    SV7 --> SB
    SV1 --> R1
    SV2 --> R2
    SV3 --> R3
    SV4 --> R3
    SV5 --> R1
    R1 --> M1
    R2 --> M2
    R3 --> M3
    M1 --> T1
    M3 --> T1
    M2 --> T1
    SF --> AC

    style CL fill:#61dafb,color:#000
    style SF fill:#e74c3c,color:#fff
    style OH fill:#e74c3c,color:#fff
    style RB fill:#e74c3c,color:#fff
    style SV6 fill:#e74c3c,color:#fff
    style G fill:#4285F4,color:#fff
    style AC fill:#27ae60,color:#fff
    style CC fill:#27ae60,color:#fff
    style FC fill:#27ae60,color:#fff
    style CMC fill:#27ae60,color:#fff
    style ADC fill:#27ae60,color:#fff
    style UPC fill:#27ae60,color:#fff
    style SV1 fill:#ff6b35,color:#fff
    style SV2 fill:#ff6b35,color:#fff
    style SV3 fill:#ff6b35,color:#fff
    style SV4 fill:#ff6b35,color:#fff
    style SV5 fill:#ff6b35,color:#fff
    style SV7 fill:#ff6b35,color:#fff
    style M1 fill:#9b59b6,color:#fff
    style M2 fill:#9b59b6,color:#fff
    style M3 fill:#9b59b6,color:#fff
    style T1 fill:#336791,color:#fff
    style SB fill:#3ecf8e,color:#000
    style subGraph1 fill:#f9e4e4
    style subGraph2 fill:#e8f5e9
    style subGraph3 fill:#fff3e0
    style subGraph4 fill:#e3f2fd
    style subGraph5 fill:#f3e5f5
    style subGraph6 fill:#e0f2f1
```

---

## Flows

### Authentication

```mermaid
---
config:
  theme: default
  look: handDrawn
---
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend
    participant AC as AuthController
    participant US as UserService
    participant JWT as JwtService
    participant DB as Database
    participant Google

    %% Local Login
    rect rgb(220, 240, 255)
        Note over User, DB: Local Login Flow
        User->>FE: Enter email & password
        FE->>AC: POST /api/auth/login
        AC->>US: loadUserByUsername(email)
        US->>DB: findByEmail(email)
        DB-->>US: User entity
        US-->>AC: MyUserDetails
        AC->>JWT: generateToken(user)
        JWT-->>AC: JWT token
        AC-->>FE: { token, user }
        FE->>FE: Store token in userStore
        FE-->>User: Redirect to Home
    end

    %% Google OAuth
    rect rgb(220, 255, 220)
        Note over User, Google: Google OAuth Flow
        User->>FE: Click "Sign in with Google"
        FE->>AC: GET /api/auth/google/login
        AC->>Google: Redirect to OAuth2
        Google-->>User: Google Login Page
        User->>Google: Authenticate
        Google-->>AC: OAuth2 callback + code
        AC->>US: createOauthUser / updateUser
        US->>DB: save(user)
        AC->>JWT: generateToken(user)
        AC-->>FE: Redirect /oauth-callback?token=...
        FE->>AC: GET /api/auth/me
        AC-->>FE: { authenticated: true, user }
        FE-->>User: Redirect to Home
    end
```

### Complaint Lifecycle

```mermaid
---
config:
  look: handDrawn
  theme: default
---
sequenceDiagram
    autonumber
    actor User
    actor Admin
    participant FE as Frontend
    participant CC as ComplaintController
    participant CS as ComplaintService
    participant FSS as FileStorageService
    participant DB as Database
    participant SB as Supabase

    rect rgb(255, 240, 220)
        Note over User, SB: File Complaint Flow
        User->>FE: Fill complaint form + images
        FE->>CC: POST /api/complaints (multipart)
        CC->>FSS: storeFiles(images)
        FSS->>SB: Upload to Supabase bucket
        SB-->>FSS: Image URLs
        CC->>CS: createComplaint(request, imageUrls)
        CS->>DB: save(complaint) [status=SUBMITTED]
        DB-->>CS: Complaint entity
        CS-->>CC: ComplaintResponse
        CC-->>FE: { complaintId, complaint }
        FE-->>User: Show complaintId + redirect /track
    end

    rect rgb(240, 220, 255)
        Note over User, DB: Track Complaint Flow
        User->>FE: Enter complaintId
        FE->>CC: GET /api/complaints/{complaintId}
        CC->>CS: getComplaintByComplaintId(id)
        CS->>DB: findByComplaintId(id)
        DB-->>CS: Complaint
        CS-->>CC: FeedResponse
        CC-->>FE: { complaint }
        FE-->>User: Show complaint + timeline
    end

    rect rgb(220, 255, 240)
        Note over Admin, DB: Update Status Flow
        Admin->>FE: Select new status
        FE->>CC: PATCH /api/complaints/{id}/status
        CC->>CS: updateComplaintStatus(id, status)
        CS->>DB: save(complaint) [new status]
        DB-->>CS: Updated complaint
        CS-->>CC: FeedResponse
        CC-->>FE: { complaint }
        FE-->>Admin: Toast "Status updated"
    end
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/google/login` | Initiate Google OAuth |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/complaints` | File a complaint |
| GET | `/api/complaints/{id}` | Get complaint by ID |
| PATCH | `/api/complaints/{id}/status` | Update complaint status |
| GET | `/api/feed` | Get public feed |
| GET | `/api/admin/dashboard/stats` | Admin dashboard stats |
| GET | `/api/admin/users` | List all users |

---


