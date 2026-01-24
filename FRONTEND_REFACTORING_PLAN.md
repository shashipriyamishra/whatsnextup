# 🏗️ Frontend Code Review & Refactoring Plan

## 1. Critical Issues to Fix Immediately

### ✅ Sign Out Infinite Loop (FIXED)

- **Issue**: Header re-renders infinitely on logout
- **Solution**: Added `isSigningOut` state + cleanup function + `router.replace()`

### ✅ Stats API Returning DOCTYPE (FIXED)

- **Issue**: Relative URL `/api/user/tier` getting intercepted by Next.js
- **Solution**: Use full `${process.env.NEXT_PUBLIC_API_URL}/api/user/tier`

### 🔧 Trending Page Styling

- **Issue**: Light background with white text = unreadable
- **Solution**: Use dark backgrounds (gray-800/900) or better contrast

### 🔧 Tab Styling & Consistency

- **Issue**: Tabs not styled consistently, some sections still have transparency issues

---

## 2. Architecture Assessment & Refactoring

### Current Issues:

```
frontend/
├── src/
│   ├── app/              ← Mixed concerns (pages + layout)
│   ├── components/       ← Monolithic components (ChatScreen 414 lines!)
│   ├── lib/             ← Mixed utilities (auth, API, trending)
│   └── public/
```

### Problems:

1. **Component Size**: ChatScreen 414 lines - violates single responsibility
2. **API Management**: No centralized API client
3. **Utilities**: Mixed concerns in `lib/` folder
4. **Hooks**: Custom logic scattered in components
5. **State Management**: Prop drilling, no centralized state
6. **Error Handling**: Inconsistent error handling patterns
7. **Performance**: No memoization, unnecessary re-renders
8. **Type Safety**: Loose typing in some components
9. **Code Duplication**: API calls repeated across files
10. **Testing**: No test files

---

## 3. Proposed New Architecture

```
frontend/
├── src/
│   ├── app/                    ← Page routes only
│   │   ├── (auth)/            ← Auth group
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (app)/             ← App group
│   │   │   ├── chat/
│   │   │   ├── trending/
│   │   │   ├── history/
│   │   │   ├── memories/
│   │   │   ├── plans/
│   │   │   ├── reflections/
│   │   │   ├── profile/
│   │   │   ├── agents/
│   │   │   ├── pricing/
│   │   │   └── layout.tsx     ← Header here
│   │   └── page.tsx           ← Landing/Home
│   ├── components/
│   │   ├── common/            ← Reusable UI
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── chat/              ← Chat-specific
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── UsageBar.tsx
│   │   ├── feed/              ← Feed-specific
│   │   │   ├── FeedGrid.tsx
│   │   │   ├── FeedCard.tsx
│   │   │   └── TabNav.tsx
│   │   ├── ui/                ← shadcn/ui
│   │   └── contexts/          ← Context providers (move here)
│   ├── lib/
│   │   ├── api/               ← API management
│   │   │   ├── client.ts      ← API client instance
│   │   │   ├── endpoints.ts   ← Endpoint definitions
│   │   │   ├── types.ts       ← API response types
│   │   │   └── hooks.ts       ← useAPI, useFetch hooks
│   │   ├── hooks/             ← Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── useStats.ts
│   │   │   └── ...
│   │   ├── services/          ← Business logic
│   │   │   ├── authService.ts
│   │   │   ├── feedService.ts
│   │   │   └── chatService.ts
│   │   ├── constants/         ← App constants
│   │   │   ├── api.ts
│   │   │   ├── routes.ts
│   │   │   └── themes.ts
│   │   ├── utils/             ← Utilities
│   │   │   ├── format.ts
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   └── firebase.ts        ← Keep here
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── tailwind.css
│   ├── types/                 ← Global types
│   │   ├── index.ts
│   │   └── api.ts
│   └── __tests__/            ← Tests
│       ├── components/
│       ├── hooks/
│       └── services/
```

---

## 4. Performance Optimizations

### 4.1 Component Splitting

- Break ChatScreen (414 lines) into:
  - `ChatWindow.tsx` - Message display
  - `ChatInput.tsx` - Input area
  - `ChatHeader.tsx` - Header info
  - `UsageBar.tsx` - Usage display

### 4.2 Memoization Strategy

```typescript
// Use React.memo for components that don't change often
const ChatMessage = React.memo(({ message }) => ...)
const FeedCard = React.memo(({ item, onSelect }) => ...)

// Use useMemo for expensive calculations
const filteredItems = useMemo(() => items.filter(...), [items])

// Use useCallback for stable function references
const handleSend = useCallback(() => {...}, [deps])
```

### 4.3 Code Splitting

- Lazy load heavy pages: `React.lazy()` + `Suspense`
- Dynamic imports for modals/dialogs

### 4.4 API Optimization

- Request deduplication
- Automatic retry logic
- Response caching with stale-while-revalidate

---

## 5. Code Quality Standards

### 5.1 Linting & Formatting

- ESLint rules
- Prettier configuration
- Pre-commit hooks

### 5.2 Type Safety

- Full TypeScript coverage
- Strict mode enabled
- No `any` types (use `unknown` + type narrowing)

### 5.3 Error Handling

- Centralized error logging
- User-friendly error messages
- Proper error boundaries

### 5.4 Testing Coverage

- Unit tests for utils/services (80%+)
- Integration tests for hooks
- E2E tests for critical flows

---

## 6. Implementation Phases

### Phase 1: Critical Fixes (1-2 hours)

- ✅ Sign Out infinite loop
- ✅ Stats API URL issue
- 🔧 Trending page styling
- 🔧 Tab consistency

### Phase 2: Folder Restructuring (2-3 hours)

- Move auth components → `(auth)` group
- Move app components → `(app)` group
- Create `lib/api/` client
- Extract hooks to `lib/hooks/`

### Phase 3: Component Refactoring (3-4 hours)

- Split ChatScreen
- Extract feed components
- Create reusable UI components
- Add prop validation

### Phase 4: Performance (1-2 hours)

- Add React.memo where needed
- Add useMemo/useCallback
- Implement code splitting
- Optimize re-renders

### Phase 5: Quality (1-2 hours)

- Add ESLint config
- Add tests for critical functions
- Add error boundaries
- Add loading states

### Phase 6: Testing & Deployment (1-2 hours)

- Test all pages
- Test all API calls
- Check performance metrics
- Commit and push

---

## 7. Key Files to Create/Modify

### New Files

- `lib/api/client.ts` - Centralized API client
- `lib/api/endpoints.ts` - Endpoint definitions
- `lib/hooks/useStats.ts` - Stats hook
- `lib/hooks/useFetch.ts` - Fetch hook
- `lib/services/feedService.ts` - Feed logic
- `components/common/LoadingSpinner.tsx`
- `components/common/ErrorBoundary.tsx`
- `components/feed/FeedCard.tsx`
- `components/feed/FeedGrid.tsx`
- `.eslintrc.json` - Linting rules
- `jest.config.js` - Testing config

### Modified Files

- `components/Header.tsx` - Already fixed
- `components/ChatScreen.tsx` - Split into multiple
- `app/trending/page.tsx` - Styling fixes
- `AuthContext.tsx` - Move to components/contexts
- `middleware.ts` - Add if needed

---

## 8. Expected Benefits

### Code Quality

- ✅ 50% smaller average component size
- ✅ 100% TypeScript coverage
- ✅ Reduced code duplication
- ✅ Better error handling

### Performance

- ✅ ~30% fewer re-renders
- ✅ Faster page transitions (code splitting)
- ✅ Better SEO (proper page structure)
- ✅ Reduced bundle size

### Maintainability

- ✅ Easier to add new features
- ✅ Clear folder structure
- ✅ Centralized API calls
- ✅ Easy to debug

### Developer Experience

- ✅ Clear patterns to follow
- ✅ Less prop drilling
- ✅ Reusable components
- ✅ Self-documenting code

---

## 9. Timeline

| Phase                 | Duration | Status         |
| --------------------- | -------- | -------------- |
| Critical Fixes        | 1h       | 🔧 In Progress |
| Folder Restructuring  | 3h       | ⏳ Pending     |
| Component Refactoring | 4h       | ⏳ Pending     |
| Performance           | 2h       | ⏳ Pending     |
| Quality               | 2h       | ⏳ Pending     |
| Testing & Deploy      | 2h       | ⏳ Pending     |
| **TOTAL**             | **~14h** | -              |
