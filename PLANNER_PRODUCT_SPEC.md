# WhatsNextUp - AI-Powered Planner Product Specification

## Vision

Create a world-class, AI-enabled planning system where:

- Users refine plans **interactively** with AI before committing
- **Every field shows AI suggestions** in real-time
- Plans feel **alive** - editable, dynamic, nested
- **Subtasks nested inside main tasks** with full editing
- AI guides at every step of the process

---

## Architecture Overview

### Phase 1: Plan Creation Workflow (NEW)

```
User Input → AI Draft → User Reviews → AI Refinement Suggestions → Save
                ↓            ↓              ↓
           (Generate)   (Interactive)  (Suggestions)
```

### Phase 2: Interactive Plan Editor

- Edit any field (goal, timeframe, priority, steps, challenges, resources)
- Each edit shows **AI suggestions below the field** (like Google Docs)
- Nested subtasks with inline editing
- Real-time sync to backend

### Phase 3: Subtask Management

- Subtasks appear **nested inside each main step**
- Can expand/collapse step to see subtasks
- Create subtask → AI suggests breakdown
- Each subtask is editable, deletable, checkmarkable

---

## Backend Implementation Plan

### 1. Fix Model Availability Issue (CRITICAL)

**Problem**: gemini-1.5-pro not available in project
**Solution**: Use `gemini-2.0-flash` (available everywhere)
**File**: `backend/agents/llm.py`

```python
model = GenerativeModel("gemini-2.0-flash")  # Use this instead
```

### 2. Plan Generation Endpoints

```python
POST /api/plans/draft
  Request: { goal: "Learn React" }
  Response: {
    draft: {...full plan...},
    requestId: "draft_123",
    suggestions: "This is a 4-week plan focusing on..."
  }

POST /api/plans/refine
  Request: {
    requestId: "draft_123",
    feedback: "I prefer to do it in 2 weeks",
    updatedField: "timeframe"
  }
  Response: {
    draft: {...refined plan...},
    feedback: "Great! Here's an accelerated plan..."
  }

POST /api/plans/finalize
  Request: { requestId: "draft_123", draft: {...} }
  Response: { id: "plan_456", saved: true }
```

### 3. AI Suggestion Endpoints

```python
POST /api/plans/suggestions
  Request: {
    field: "goal" | "timeframe" | "priority" | "steps",
    currentValue: "...",
    context: {...full plan so far...}
  }
  Response: {
    suggestions: ["option 1", "option 2", "option 3"],
    reasoning: "..."
  }

POST /api/plans/{id}/steps/{stepId}/breakdown
  Request: { step: {...}, depth: "detailed" | "basic" }
  Response: {
    subtasks: [...],
    timing: "...",
    dependencies: [...]
  }
```

### 4. Firestore Schema

```
users/{uid}/plans/{planId}
  ├─ goal: string
  ├─ timeframe: string
  ├─ priority: "high" | "medium" | "low"
  ├─ status: "draft" | "active" | "completed" | "paused"
  ├─ steps: [{
  │   ├─ id: string
  │   ├─ action: string
  │   ├─ deadline: string
  │   ├─ effort: "low" | "medium" | "high"
  │   ├─ status: "pending" | "in_progress" | "done"
  │   ├─ subtasks: [{  ← NEW: nested subtasks
  │   │   ├─ id: string
  │   │   ├─ title: string
  │   │   ├─ duration: string
  │   │   ├─ order: number
  │   │   └─ status: "pending" | "done"
  │   │ }]
  │   └─ notes: string  ← NEW: user notes
  ├─ potential_challenges: string[]
  ├─ resources_needed: string[]
  ├─ success_metric: string
  ├─ tags: string[]
  ├─ createdAt: timestamp
  ├─ updatedAt: timestamp
  └─ draftData: {...}  ← For draft states
```

---

## Frontend Implementation Plan

### 1. Plan Creation Flow (NEW)

**File**: `frontend/src/app/plans/create/page.tsx`

#### Step 1: Goal Input

```tsx
<PlanCreationStep1>
  <textarea
    placeholder="What do you want to achieve?"
    onChange={(text) => {
      getSuggestions("goal", text) // Show suggestions
    }}
  />
  <SuggestionBox suggestions={goalSuggestions} />
</PlanCreationStep1>
```

#### Step 2: AI Draft Review

```tsx
<PlanCreationStep2>
  <DraftPreview plan={aiDraft} />
  <button onClick={() => goToRefine()}>Refine Plan</button>
  <button onClick={() => editField("timeframe")}>Edit Timeframe</button>
</PlanCreationStep2>
```

#### Step 3: Interactive Refinement

```tsx
<PlanCreationStep3>
  <EditableField
    label="Timeframe"
    value={plan.timeframe}
    onChange={(value) => handleRefine("timeframe", value)}
    suggestions={getFieldSuggestions("timeframe", value)}
  />
  <SuggestionBox
    suggestions={timeframeSuggestions}
    onApply={(suggestion) => apply(suggestion)}
  />
</PlanCreationStep3>
```

#### Step 4: Save & Review

```tsx
<PlanCreationStep4>
  <PlanPreview plan={plan} />
  <button onClick={savePlan}>Save Plan</button>
</PlanCreationStep4>
```

### 2. Plan Editor Component (NEW)

**File**: `frontend/src/components/PlanEditor.tsx`

```tsx
<PlanEditor plan={plan} onSave={handleSave}>
  <EditableField
    label="Goal"
    value={plan.goal}
    onInput={throttledGetSuggestions}
  />

  <EditableField
    label="Timeframe"
    value={plan.timeframe}
    onInput={throttledGetSuggestions}
  />

  <EditableField
    label="Priority"
    type="select"
    options={["high", "medium", "low"]}
    value={plan.priority}
  />

  <StepList steps={plan.steps}>
    {plan.steps.map((step) => (
      <EditableStep
        step={step}
        onEdit={handleEditStep}
        onDelete={handleDeleteStep}
        onAddSubtask={handleAddSubtask}
      >
        {step.subtasks && (
          <SubtaskList subtasks={step.subtasks}>
            {step.subtasks.map((subtask) => (
              <EditableSubtask
                subtask={subtask}
                onEdit={handleEditSubtask}
                onDelete={handleDeleteSubtask}
                onToggleDone={handleToggleSubtaskDone}
              />
            ))}
          </SubtaskList>
        )}
      </EditableStep>
    ))}
  </StepList>
</PlanEditor>
```

### 3. Suggestion Box Component (NEW)

**File**: `frontend/src/components/SuggestionBox.tsx`

```tsx
<SuggestionBox suggestions={suggestions} loading={isLoading} onApply={onApply}>
  <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30">
    💡 AI Suggestion:
    {suggestions.map((s, i) => (
      <button
        key={i}
        onClick={() => onApply(s)}
        className="block w-full text-left p-2 hover:bg-white/10"
      >
        ✓ {s}
      </button>
    ))}
  </div>
</SuggestionBox>
```

### 4. Editable Field Component (NEW)

**File**: `frontend/src/components/EditableField.tsx`

```tsx
<EditableField
  label={label}
  value={value}
  onChange={onChange}
  onInput={onInput}
  suggestions={suggestions}
>
  <input
    value={value}
    onChange={(e) => {
      onChange(e.target.value)
      onInput?.(e.target.value) // Trigger suggestions
    }}
    onBlur={() => saveDraft()}
  />
  {suggestions && (
    <SuggestionBox suggestions={suggestions} onApply={(s) => onChange(s)} />
  )}
</EditableField>
```

### 5. Step List with Subtasks (NEW)

**File**: `frontend/src/components/StepList.tsx`

```tsx
<div className="space-y-3">
  {steps.map((step, idx) => (
    <div key={step.id} className="p-4 border rounded-lg">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={step.status === "done"}
          onChange={(e) => toggleStepDone(step.id)}
        />

        <div className="flex-1">
          <div className="font-semibold text-white">
            {idx + 1}. {step.action}
          </div>

          {/* Subtasks */}
          {step.subtasks?.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-white/20 space-y-2">
              <h4 className="text-sm text-white/70">Subtasks:</h4>
              {step.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={subtask.status === "done"}
                    onChange={() => toggleSubtaskDone(step.id, subtask.id)}
                  />
                  <span>{subtask.title}</span>
                  <button
                    onClick={() => editSubtask(step.id, subtask.id)}
                    className="ml-auto text-xs opacity-50 hover:opacity-100"
                  >
                    ✏️
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => showAddSubtask(step.id)}
            className="mt-2 text-xs text-purple-400"
          >
            + Add subtask
          </button>
        </div>

        <div className="flex gap-1">
          <button onClick={() => editStep(step)}>✏️</button>
          <button onClick={() => deleteStep(step.id)}>🗑️</button>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## Implementation Phases

### Phase A: Fix Model (Today)

- [ ] Change gemini-1.5-pro to gemini-2.0-flash
- [ ] Deploy backend
- [ ] Verify plans/memories work

### Phase B: Draft & Suggestion System (Day 1)

- [ ] Add `/api/plans/draft` endpoint
- [ ] Add `/api/plans/refine` endpoint
- [ ] Add `/api/plans/suggestions` endpoint
- [ ] Test all endpoints

### Phase C: Frontend Plan Creation Flow (Day 2)

- [ ] Create PlanCreationStep1-4 components
- [ ] Implement step navigation
- [ ] Add suggestion display
- [ ] Test creation flow

### Phase D: Interactive Plan Editor (Day 3)

- [ ] Create PlanEditor component
- [ ] Create EditableField component
- [ ] Create SuggestionBox component
- [ ] Implement field editing with auto-save

### Phase E: Subtasks & Nesting (Day 4)

- [ ] Add subtasks to Firestore schema
- [ ] Create StepList component
- [ ] Implement subtask CRUD
- [ ] Add nested UI

### Phase F: Polish & Testing (Day 5)

- [ ] Add loading states
- [ ] Error handling
- [ ] Performance optimization
- [ ] User testing

---

## Success Metrics

- ✅ User can create plan interactively (not just send goal)
- ✅ AI suggestions appear in real-time while typing
- ✅ Users can edit any field and see AI suggestions
- ✅ Subtasks nested inside steps with full editing
- ✅ Plans save to Firestore with all data preserved
- ✅ Plan reflects as "dynamic" and "alive"
- ✅ Response time < 2 seconds for suggestions
- ✅ User satisfaction 4+/5 stars

---

## Technical Considerations

### Performance

- Debounce suggestion requests (500ms)
- Cache suggestions locally
- Use streaming for long suggestions
- Pagination for large plans

### UX/DX

- Show loading indicators during AI calls
- Fallback suggestions if AI fails
- Keyboard shortcuts for actions
- Mobile-responsive design

### AI Quality

- Use system prompts for consistency
- Few-shot examples in prompts
- Validate AI output (JSON schema)
- Retry on failures

### Data Consistency

- Draft state saved locally
- Optimistic updates on UI
- Sync conflict resolution
- Audit trail for changes
