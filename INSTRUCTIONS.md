dependencies needed:

nativewind (this command is used because this is an expo project)

npm install nativewind tailwindcss@^3.4.17 react-native-reanimated@3.16.2 react-native-safe-area-context

shadcnui

npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css

make sure to install cocoapods (requries ruby >=3.1.0 as of 4/29/25)


project structure
app/
  _layout.tsx         // (optional) Root layout for navigation (Stack, Tabs, etc.)
  index.tsx           // Home screen ("/")
  profile.tsx         // Profile screen ("/profile")
  settings.tsx        // Settings screen ("/settings")
  posts/
    index.tsx         // Posts list screen ("/posts")
    [id].tsx          // Dynamic route for post details ("/posts/123")