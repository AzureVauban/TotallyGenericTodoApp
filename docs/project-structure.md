Project Directory:

app/
├── _layout.tsx
├── confirmCode.tsx
├── confirmPassword.tsx
├── EmailAuthScreen.tsx
├── home.tsx
├── index.tsx
├── inputCode.tsx
├── loginScreen.tsx
├── PhoneAuthScreen.tsx
├── registerAccount.tsx
├── resetPassword.tsx
├── settingScreen.tsx
├── taskLists
│   ├── [id].tsx
│   └── taskGroups
│       ├── allTasks.tsx
│       ├── completedTasks.tsx
│       ├── flaggedTasks.tsx
│       └── scheduledTasks.tsx
├── theme
│   ├── colors.ts
│   ├── index.ts
│   ├── samplecolors.log
│   └── ThemeContext.tsx
└── verificationMethod.tsx

backend/
└── storage
    ├── TasksContext.tsx
    ├── tasksStorage.ts
    └── types.ts

lib/
├── supabaseClient.ts
└── utils.ts

utils/
├── generateUsername.ts
├── playCompleteSound.ts
├── playFlaggedSound.ts
├── playIndentTaskSound.ts
├── playInvalidSound.ts
├── playRemoveSound.ts
├── playRenameSound.ts
└── playUnflaggedSound.ts

supabase/
├── config.toml
└── migrations
    └── 20250516005607_create_profiles_table.sql