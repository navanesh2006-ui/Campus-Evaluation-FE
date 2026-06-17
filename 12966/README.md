# Campus Notifications Microservice Frontend

A complete React + TypeScript campus notification dashboard designed using Material UI, implementing custom logger middleware, state context stores, and a Min-Heap priority inbox algorithm.

---

## Technical Stack
*   **Core**: React + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Material UI (MUI) Only
*   **Logging**: Remote Log POST service (zero `console.log` statements)
*   **State Management**: React Context + useReducer with LocalStorage persistence

---

## Folder Structure

```text
src/
├── middleware/
│   └── logger.ts              # Logging middleware to evaluation endpoint
├── auth/
│   └── token.ts               # Local authentication token store
├── api/
│   └── notifications.ts       # API Client for fetching campus notifications
├── utils/
│   └── priorityInbox.ts       # Min-Heap sorting utility for top-N ranking
├── hooks/
│   └── useNotifications.ts    # React Hook synchronising state with API filters
├── state/
│   └── notificationStore.ts   # Context & Reducer state manager
├── components/
│   ├── NotificationCard.tsx   # Individual event visual card
│   ├── FilterBar.tsx          # Dashboard select selectors for limits & type
│   ├── PrioritySelector.tsx   # ToggleButtonGroup for N count Selection
│   └── NotificationBadge.tsx  # Unread badge indicator for Header
├── pages/
│   ├── AllNotificationsPage.tsx   # All-inbox page view with paginated lists
│   └── PriorityInboxPage.tsx      # Top-N inbox view with ranked labels
├── App.tsx                    # Layout shell, router and auth boots
└── main.tsx                   # Bootstrapping entry point
stage1/
└── priorityInbox.ts           # Standalone verification CLI script
```

---

## Registration & Authentication Flow

Follow these instructions to acquire a Bearer token and initialize the application.

### 1. Register a client profile (Done Once)
Send a POST request to create your client credentials:
*   **URL**: `POST http://4.224.186.213/evaluation-service/register`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "<your_email>",
      "name": "<your_name>",
      "mobileNo": "<your_mobile>",
      "githubUsername": "<your_github_username>",
      "rollNo": "<your_roll_number>",
      "accessCode": "juFphv"
    }
    ```
*   **Response**: Returns `clientID` and `clientSecret`. Keep these safe as they cannot be retrieved again.

### 2. Request an Auth Token
Use your registered details to request a short-lived Bearer token:
*   **URL**: `POST http://4.224.186.213/evaluation-service/auth`
*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "email": "<your_email>",
      "name": "<your_name>",
      "rollNo": "<your_roll_number>",
      "accessCode": "juFphv",
      "clientID": "<your_clientID>",
      "clientSecret": "<your_clientSecret>"
    }
    ```
*   **Response**:
    ```json
    {
      "token_type": "Bearer",
      "access_token": "YOUR_SHORT_LIVED_TOKEN_HERE",
      "expires_in": 3600
    }
    ```

### 3. Initialize Token in Application
Open [token.ts](file:///c:/Users/navih/notification-app-fe/src/auth/token.ts) and paste the token string:
```typescript
export const BEARER_TOKEN = "YOUR_SHORT_LIVED_TOKEN_HERE";
export const getToken = () => BEARER_TOKEN;
```

---

## Installation & Running

### Install Dependencies
```bash
npm install
```

### Run Web Application Locally
Launch the Vite server on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Run Standalone Priority Inbox Script (Stage 1)
Run the TypeScript CLI verification script:
```bash
npx ts-node stage1/priorityInbox.ts
```
*(Results will be printed directly via the `Log()` service logs endpoint. Confirm outputs on the logging service).*
