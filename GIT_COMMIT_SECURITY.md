# Git Commit & Security Guidelines

## 🔒 What Should NEVER Be Committed

### ❌ NEVER Commit These Files:

```
.env
.env.local
.env.production
*.pem
*.key
*.crt
service-account-key.json
firebase-adminsdk-*.json
config/secrets.json
```

### ❌ NEVER Commit These Patterns:

- API keys (any string starting with `sk_`, `pk_`, etc.)
- Firebase config with private keys
- Database passwords
- OAuth client secrets
- JWT secrets
- Stripe secret keys
- Any file with actual credentials

---

## ✅ What SHOULD Be Committed

### ✅ Documentation Files (Safe):

```
✅ README.md
✅ MONETIZATION_PLAN.md
✅ API_KEYS_SETUP.md (instructions only, no actual keys)
✅ DEPLOYMENT_GUIDE.md
✅ BACKEND_DEPLOY_NEEDED.md
✅ API_FIX_GUIDE.md
✅ GIT_COMMIT_SECURITY.md (this file)
```

### ✅ Configuration Templates:

```
✅ .env.example (with placeholder values)
✅ config.sample.json
```

### ✅ Code Files:

```
✅ All .py, .ts, .tsx files
✅ package.json, requirements.txt
✅ tsconfig.json, next.config.ts
```

---

## 🔍 Pre-Commit Security Checklist

Before EVERY commit, check:

1. **Search for API keys:**

   ```bash
   # Search for potential keys
   git grep -i "api[_-]key\s*=\s*['\"]" -- ':!*.md'
   git grep -i "secret\s*=\s*['\"]" -- ':!*.md'
   git grep -E "sk_[a-zA-Z0-9]{24,}" -- ':!*.md'
   git grep -E "pk_[a-zA-Z0-9]{24,}" -- ':!*.md'
   ```

2. **Check staged files:**

   ```bash
   git diff --staged --name-only | grep -E '(.env|secret|key|pem|crt)'
   ```

3. **Review .gitignore:**
   ```bash
   # Make sure .gitignore includes:
   cat .gitignore | grep -E '(.env|*.key|*secret)'
   ```

---

## 📝 Safe Documentation Practices

### When Writing Docs:

✅ **Good - Use Placeholders:**

```bash
export NEWS_API_KEY="your_key_here"
export STRIPE_SECRET_KEY="sk_live_xxxxx"
```

❌ **Bad - Actual Keys:**

```bash
export NEWS_API_KEY="abc123real456key789"
```

✅ **Good - Generic Examples:**

```python
API_KEY = os.getenv("API_KEY")  # Get from environment
```

❌ **Bad - Hardcoded:**

```python
API_KEY = "sk_live_51Hxxx..."  # Real key
```

---

## 🛡️ .gitignore Setup

Your `.gitignore` should include:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.*.local

# API Keys & Secrets
*.key
*.pem
*.crt
*secret*.json
service-account-key.json
firebase-adminsdk-*.json

# Build outputs
__pycache__/
*.pyc
.next/
node_modules/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 🚀 Safe Commit Workflow

```bash
# 1. Stage your changes
git add .

# 2. Check what's staged
git diff --staged --name-only

# 3. Search for secrets in staged files
git diff --staged | grep -i "api[_-]key"
git diff --staged | grep -i "secret"

# 4. If clean, commit
git commit -m "feat: your message"

# 5. Before push, final check
git log -1 -p | grep -i "api[_-]key"

# 6. Push
git push origin main
```

---

## 🔐 If You Accidentally Commit a Secret

### Option 1: Immediate Fix (if not pushed yet)

```bash
# Remove the last commit (keeps changes)
git reset --soft HEAD~1

# Remove the secret from files
# Edit files to remove secrets

# Commit again
git add .
git commit -m "your message"
```

### Option 2: Already Pushed (URGENT)

```bash
# 1. IMMEDIATELY rotate the exposed key
# - Go to the service provider (Stripe, Firebase, etc.)
# - Revoke the old key
# - Generate a new key

# 2. Remove from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (dangerous, use carefully)
git push origin --force --all
```

---

## 📊 What We've Created So Far

### ✅ Safe to Commit:

- `MONETIZATION_PLAN.md` - Business strategy (no secrets)
- `API_KEYS_SETUP.md` - Instructions only (no actual keys)
- `DEPLOYMENT_GUIDE.md` - How-to guide (no secrets)
- `BACKEND_DEPLOY_NEEDED.md` - Deployment steps (no secrets)
- `API_FIX_GUIDE.md` - API reference (no secrets)
- `GIT_COMMIT_SECURITY.md` - This file (no secrets)

### ❌ DO NOT Commit:

- Any `.env` files with actual keys
- Any files with real API keys
- Firebase service account JSON files
- Stripe secret keys

---

## 🎯 Summary

**Golden Rules:**

1. ✅ Commit all documentation with **placeholder** values
2. ❌ Never commit files with **actual** credentials
3. 🔍 Always search for secrets before committing
4. 🔐 Use environment variables for all secrets
5. 📝 Keep .gitignore updated

**All the MD files I created are safe to commit** - they contain instructions and placeholders only, no actual secrets.
