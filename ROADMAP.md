# whatsnextup - Complete Roadmap

## Current Status (Phase 3 ✅)

- **Chat interface**: Working, basic messaging
- **Plans creation**: Working, generates structured plans with AI
- **Reflections**: Working, captures thoughts
- **Memories**: Working, stores and retrieves memories
- **Authentication**: Working, JWT with Firebase
- **Database**: Firestore with proper collections and indexes

---

## Critical Issues to Address

### 1. 🤖 AI Response Quality Issue (URGENT)

**Problem**: `gemini-2.5-flash` gives vague, truncated, and incomplete responses

**Root Causes**:

- `gemini-2.5-flash` is a lightweight model optimized for speed over quality
- Possible token limits (output_tokens set to 256 in code)
- Model may be cutting off complex responses

**Solutions**:

#### Option A: Better Model (RECOMMENDED)

```python
# In backend/agents/llm.py - Change this:
model = GenerativeModel("gemini-2.5-flash")

# To one of these (in order of quality/speed tradeoff):
model = GenerativeModel("gemini-2.0-pro")  # Best quality, slower
model = GenerativeModel("gemini-1.5-pro")  # Excellent quality, faster than 2.0-pro
model = GenerativeModel("gemini-2.0-pro-exp-12-18")  # Latest experimental
```

**Model Comparison**:
| Model | Quality | Speed | Cost | Use Case |
|-------|---------|-------|------|----------|
| gemini-2.5-flash | ⭐⭐ | ⚡⚡⚡ | Low | Chat responses |
| gemini-2.0-flash | ⭐⭐⭐ | ⚡⚡ | Low | Better chat |
| gemini-1.5-pro | ⭐⭐⭐⭐ | ⚡ | Med | Complex planning |
| gemini-2.0-pro | ⭐⭐⭐⭐⭐ | ⚡ | Med | Best quality |

#### Option B: Increase Token Limits

```python
# In backend/agents/llm.py - Change:
generation_config={
    "temperature": 0.4,
    "max_output_tokens": 256,  # INCREASE THIS
}

# To:
generation_config={
    "temperature": 0.4,
    "max_output_tokens": 1024,  # More space for responses
}
```

#### Option C: Improve Prompts (PARALLEL SOLUTION)

Add system prompts that prevent truncation:

```python
system_prompt = """You are whatsnextup AI - a personal operating system.
IMPORTANT: Always provide COMPLETE responses. Do not truncate.
Structure responses with:
1. Main insight/answer
2. Key details
3. Actionable next steps
Be thorough and detailed."""
```

**Recommended Action**: Use **gemini-1.5-pro** + increase tokens to 512-1024 + improve prompts

---

### 2. 📝 Plans Are Too Static (PHASE 4 FEATURE)

**Current State**: Plans display but have no interactions

**Missing Features**:

- ❌ No edit button
- ❌ No delete button
- ❌ No mark complete
- ❌ No sub-plan creation
- ❌ No step tracking/checking off
- ❌ No AI follow-up suggestions

**Implementation Plan**:

#### Frontend Changes Needed (plans/page.tsx):

```tsx
// Add action buttons for each plan:
;<div className="flex gap-2 mt-4">
  <button onClick={() => editPlan(plan.id)}>✏️ Edit</button>
  <button onClick={() => markComplete(plan.id)}>✅ Complete</button>
  <button onClick={() => createSubPlan(plan.id)}>➕ Add Sub-Plan</button>
  <button onClick={() => generateNextSteps(plan.id)}>🤖 Next Steps</button>
  <button onClick={() => deletePlan(plan.id)}>🗑️ Delete</button>
</div>

// Step tracking:
{
  plan.steps.map((step, idx) => (
    <div className="flex items-center gap-2">
      <input type="checkbox" onChange={() => toggleStep(plan.id, idx)} />
      <span>{step.action}</span>
    </div>
  ))
}
```

#### Backend Changes Needed:

```python
# Add to backend/main.py:
@app.put("/api/plans/{plan_id}")
def update_plan(plan_id: str, updates: Dict, user: dict = Depends(get_current_user)):
    """Update plan status, steps, etc."""
    pass

@app.delete("/api/plans/{plan_id}")
def delete_plan(plan_id: str, user: dict = Depends(get_current_user)):
    """Delete a plan"""
    pass

@app.post("/api/plans/{plan_id}/subplans")
def create_subplan(plan_id: str, subplan: Dict, user: dict = Depends(get_current_user)):
    """Create sub-plan from a plan step"""
    pass

@app.post("/api/plans/{plan_id}/next-steps")
def get_next_steps(plan_id: str, user: dict = Depends(get_current_user)):
    """AI generates next action steps based on current plan progress"""
    pass
```

---

### 3. 🧠 Memory Categories Not Working (PHASE 4 FEATURE)

**Current State**: Memories are saved but not categorized properly

**Problem**: Can't see memories in different categories (Goals, Insights, Preferences, etc.)

**Missing Features**:

- ❌ No category selector when saving
- ❌ No category tabs/filters
- ❌ No metadata extraction
- ❌ No duplicate detection

**Implementation Plan**:

#### Frontend Changes (memories/page.tsx - TO CREATE):

```tsx
export default function MemoriesPage() {
  // Add category tabs
  const categories = [
    "All",
    "Goals",
    "Insights",
    "Preferences",
    "Habits",
    "Lessons",
  ]

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Memory cards */}
      {memories.map((memory) => (
        <div className="p-4 rounded border">
          <span className="badge">{memory.category}</span>
          <p>{memory.content}</p>
          <small>{memory.created_at}</small>
          <button onClick={() => deleteMemory(memory.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

#### Backend Changes (agents/memory_agent.py):

```python
def categorize_memory(self, content: str) -> str:
    """Use AI to auto-categorize memories"""
    categories = ['Goals', 'Insights', 'Preferences', 'Habits', 'Lessons', 'Ideas']

    prompt = f"""Categorize this memory into ONE of: {', '.join(categories)}
    Memory: {content}
    Respond with ONLY the category name."""

    category = self.llm(prompt).strip()
    return category if category in categories else 'Insights'

def save_with_context(self, content: str, metadata: Dict = None):
    """Save memory with auto-categorization"""
    category = self.categorize_memory(content)

    memory_doc = {
        'content': content,
        'category': category,
        'created_at': datetime.utcnow(),
        'metadata': metadata or {}
    }
    # Save to Firestore
```

---

### 4. 🚀 AI Should Do Something After Saving (PHASE 4 FEATURE)

**Current State**: Plan saved = nothing happens. Reflection saved = nothing happens.

**Desired Behavior**:

#### When Plan is Saved:

```
User: "I want to learn React"
AI: "✓ Saved plan! Now I'm breaking down the learning path..."
→ AI generates: subtasks, timeline, resources, potential challenges
→ AI suggests: "Want me to schedule daily learning sessions?"
→ AI offers: "Should I set milestones and reminders?"
```

#### When Reflection is Saved:

```
User: "I'm struggling with focus lately"
AI: "✓ Saved reflection. Let me analyze this..."
→ AI generates: insights about patterns, suggestions, questions to consider
→ AI suggests: "Would you like me to create a focus-improvement plan?"
```

#### When Memory is Saved:

```
User: "I love working in coffee shops"
AI: "✓ Remembered! This goes in your Preferences..."
→ AI offers: "Should I recommend coffee shops near your meetings?"
→ AI learns: updates context for future planning
```

**Implementation**:

```python
# backend/main.py
@app.post("/api/plans")
def create_plan(request: PlanRequest, user: dict = Depends(get_current_user)):
    # ... existing code to create plan ...

    plan_id = plans_db.save_plan(uid, request.goal, plan)

    # NEW: Post-save AI action
    follow_up = generate_ai_followup_for_plan(plan, request.goal)

    return {
        "id": plan_id,
        "plan": plan,
        "followUp": follow_up,  # AI suggestion for next action
        "suggestedActions": [
            {"action": "schedule", "text": "Schedule daily check-ins?"},
            {"action": "assign", "text": "Assign this to a project?"},
            {"action": "notify", "text": "Set reminders?"}
        ]
    }

def generate_ai_followup_for_plan(plan: Dict, goal: str) -> str:
    """Generate follow-up suggestion after plan creation"""
    prompt = f"""
The user just created this plan for: {goal}
Plan steps: {plan['steps']}

Suggest ONE specific next action to take immediately. Be enthusiastic and actionable.
Keep it to 1 sentence."""
    return call_llm(prompt)
```

---

## Phase 4: Interactive Intelligence (NEXT PHASE)

### 4.1 - Plan Interactivity (Week 1)

- [ ] Add CRUD operations for plans
- [ ] Add step tracking (checkboxes)
- [ ] Add sub-plan creation
- [ ] Add status updates (active/paused/completed)
- [ ] Add edit functionality

### 4.2 - Memory Intelligence (Week 1-2)

- [ ] Implement auto-categorization
- [ ] Add memory search/filtering
- [ ] Add duplicate detection
- [ ] Add metadata extraction
- [ ] Create memories page UI

### 4.3 - Reflection Insights (Week 2)

- [ ] AI pattern detection from reflections
- [ ] Generate emotional trend analysis
- [ ] Suggest related past reflections
- [ ] Create insights dashboard
- [ ] Add reflection follow-ups

### 4.4 - AI Post-Save Actions (Week 2-3)

- [ ] Plan creation → suggest next steps
- [ ] Reflection saved → offer insights
- [ ] Memory saved → update context
- [ ] Add suggested action buttons
- [ ] Track user interactions with suggestions

### 4.5 - Improve Model Quality (Week 1 - URGENT)

- [ ] Switch to gemini-1.5-pro
- [ ] Increase output tokens to 512-1024
- [ ] Improve system prompts
- [ ] Add response quality tests

---

## Phase 5: Notifications & Scheduling (LATER PHASES)

### 5.1 - Notifications System

- [ ] Create notifications collection in Firestore
- [ ] Implement real-time notification delivery
- [ ] Add notification preferences
- [ ] Web push notifications
- [ ] In-app notification badge

### 5.2 - Scheduler

- [ ] Add background scheduler (APScheduler or similar)
- [ ] Schedule plan reminders
- [ ] Daily check-in prompts
- [ ] Weekly reflection prompts
- [ ] Milestone notifications

### 5.3 - Integration Features

- [ ] Calendar integration (show plan deadlines)
- [ ] Email summaries
- [ ] Slack integration (optional)
- [ ] Google Calendar sync

---

## Phase 6: Advanced AI Features (FUTURE)

### 6.1 - Personalization

- [ ] Learn user preferences from interactions
- [ ] Adapt AI tone based on mood
- [ ] Remember user context across sessions
- [ ] Predict what user needs next

### 6.2 - Proactive Assistance

- [ ] Suggest plans based on patterns
- [ ] Warn about potential obstacles
- [ ] Recommend resources
- [ ] Connect related goals/memories

### 6.3 - Analytics & Insights

- [ ] Goal completion rate
- [ ] Learning curves
- [ ] Mood trends
- [ ] Productivity metrics
- [ ] Export personal insights

---

## Immediate Action Items (This Week)

### 🔴 Priority 1: Fix AI Response Quality

1. Change model to `gemini-1.5-pro` in `backend/agents/llm.py`
2. Increase `max_output_tokens` to 1024
3. Add system prompt guidance
4. Test with sample prompts
5. Deploy and verify

### 🟠 Priority 2: Implement Plan CRUD

1. Add update/delete endpoints
2. Add sub-plan creation endpoint
3. Create plan detail page (or modal)
4. Add action buttons to plan cards
5. Test all operations

### 🟡 Priority 3: Fix Memory Categories

1. Add categorization logic to memory_agent.py
2. Create memories page
3. Add category filters
4. Test auto-categorization
5. Deploy

### 🟢 Priority 4: Post-Save AI Actions

1. Create follow-up suggestion function
2. Add suggested actions in response
3. Test workflow
4. Update frontend to show suggestions
5. Add action handlers

---

## Technical Debt to Address

- [ ] Remove debug print statements (once debugging complete)
- [ ] Add comprehensive error handling
- [ ] Add request validation
- [ ] Add rate limiting per user (not just IP)
- [ ] Add data retention policies
- [ ] Add backup strategy
- [ ] Add logging infrastructure
- [ ] Add monitoring/alerting

---

## Success Metrics

- ✅ Plans have interactive CRUD operations
- ✅ Users can create sub-plans
- ✅ Memories are properly categorized
- ✅ AI provides substantive, complete responses
- ✅ System proactively suggests actions
- ✅ Users rate AI quality as 4+ / 5
- ✅ Average response time < 3 seconds
- ✅ No 500 errors on API calls
