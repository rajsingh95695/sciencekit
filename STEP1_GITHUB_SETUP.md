# Step 1: GitHub Setup - Complete Detailed Guide

## 📋 Prerequisites
1. **Git installed** on your computer
2. **GitHub account** (create at [github.com/signup](https://github.com/signup))
3. Your project folder: `c:\Users\rajsi\OneDrive\Desktop\my web`

---

## 🎯 Step 1.1: Check Git Installation

### Open Command Prompt as Administrator:
1. Press `Windows + X`
2. Select "Windows Terminal (Admin)" or "Command Prompt (Admin)"
3. Type:
```cmd
git --version
```

### Expected Output:
```
git version 2.45.0.windows.1
```

### If Git is NOT installed:
1. Download from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings
4. Restart Command Prompt after installation

---

## 🎯 Step 1.2: Initialize Git Repository

### Open Command Prompt in your project folder:
```cmd
cd "c:\Users\rajsi\OneDrive\Desktop\my web"
```

### Initialize Git:
```cmd
git init
```

**Expected Output:**
```
Initialized empty Git repository in C:/Users/rajsi/OneDrive/Desktop/my web/.git/
```

### Check status:
```cmd
git status
```

**Expected Output:** Shows all your files as "untracked"

---

## 🎯 Step 1.3: Configure Git User (First Time Only)

### Set your name and email:
```cmd
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Example:**
```cmd
git config --global user.name "Raj Singh"
git config --global user.email "raj@example.com"
```

### Verify configuration:
```cmd
git config --list
```

---

## 🎯 Step 1.4: Add Files to Git

### Add all files:
```cmd
git add .
```

**Explanation:** The `.` means "all files in current directory"

### Check what was added:
```cmd
git status
```

**Expected Output:** Shows files as "changes to be committed"

---

## 🎯 Step 1.5: Commit Files

### Create first commit:
```cmd
git commit -m "Initial commit - ScienceKit.in e-commerce website"
```

**Expected Output:**
```
[main (root-commit) abc1234] Initial commit - ScienceKit.in e-commerce website
 100 files changed, 15000 insertions(+)
 create mode 100644 app/page.tsx
 create mode 100644 package.json
 ... (more files)
```

---

## 🎯 Step 1.6: Create GitHub Repository

### **Open Browser and go to:**
https://github.com/new

### **Fill Repository Details:**

| Field | Value to Enter |
|-------|----------------|
| **Repository name** | `sciencekit` |
| **Description** | `ScienceKit.in - E-commerce for science kits` |
| **Visibility** | `Public` (Recommended for free) |
| **Initialize with README** | ❌ **UNCHECK** (Important!) |
| **Add .gitignore** | ❌ Leave as "None" |
| **Choose a license** | ❌ Leave as "None" |

### **Click "Create repository"**

**Important:** Do NOT check "Initialize with README" because you already have code.

---

## 🎯 Step 1.7: Connect Local Repository to GitHub

### After creating repository, you'll see this page:
![GitHub Quick Setup](https://docs.github.com/assets/cb-11427/images/help/repository/quick-setup.png)

### **Copy the commands from GitHub:**
Look for this section:
```cmd
git remote add origin https://github.com/YOUR_USERNAME/sciencekit.git
git branch -M main
git push -u origin main
```

### **Run these commands in your Command Prompt:**

#### 1. Add remote origin:
```cmd
git remote add origin https://github.com/YOUR_USERNAME/sciencekit.git
```
**Replace `YOUR_USERNAME` with your actual GitHub username**

#### 2. Rename branch to main:
```cmd
git branch -M main
```

#### 3. Push to GitHub:
```cmd
git push -u origin main
```

---

## 🎯 Step 1.8: Authentication

### **If prompted for credentials:**

#### Option A: Personal Access Token (Recommended)
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Select "repo" scope
4. Copy the token
5. When prompted for password, paste the token

#### Option B: SSH Key (Advanced)
```cmd
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

---

## 🎯 Step 1.9: Verify Push Success

### Check push status:
```cmd
git push -u origin main
```

**Expected Success Output:**
```
Enumerating objects: 100, done.
Counting objects: 100% (100/100), done.
Delta compression using up to 8 threads
Compressing objects: 100% (95/95), done.
Writing objects: 100% (100/100), 1.5 MiB | 1.2 MiB/s, done.
Total 100 (delta 15), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (15/15), done.
To https://github.com/YOUR_USERNAME/sciencekit.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Verify on GitHub:
1. Go to: `https://github.com/YOUR_USERNAME/sciencekit`
2. You should see all your files
3. Check commit history

---

## 🎯 Step 1.10: Common Issues & Solutions

### Issue 1: "fatal: remote origin already exists"
**Solution:**
```cmd
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/sciencekit.git
```

### Issue 2: "failed to push some refs"
**Solution:**
```cmd
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue 3: Authentication failed
**Solution:**
```cmd
# Clear cached credentials
git config --global --unset credential.helper
git config --global credential.helper store

# Try push again
git push -u origin main
```

### Issue 4: Large files error
**Solution:**
```cmd
# Remove large files
git rm --cached large-file.zip

# Add to .gitignore
echo "*.zip" >> .gitignore
echo "*.mp4" >> .gitignore

# Commit and push again
git add .
git commit -m "Remove large files"
git push -u origin main
```

---

## 🎯 Step 1.11: Final Verification

### Check remote URL:
```cmd
git remote -v
```

**Expected Output:**
```
origin  https://github.com/YOUR_USERNAME/sciencekit.git (fetch)
origin  https://github.com/YOUR_USERNAME/sciencekit.git (push)
```

### Check branch:
```cmd
git branch -a
```

**Expected Output:**
```
* main
  remotes/origin/main
```

### Check last commit:
```cmd
git log --oneline -5
```

---

## 📱 Alternative: Using GitHub Desktop

### If command line is difficult, use GitHub Desktop:

1. **Download GitHub Desktop**: https://desktop.github.com
2. **Install and open**
3. **Sign in with GitHub account**
4. **Add local repository**:
   - File → Add Local Repository
   - Browse to `c:\Users\rajsi\OneDrive\Desktop\my web`
   - Click "Add Repository"
5. **Commit changes**:
   - Write commit message
   - Click "Commit to main"
6. **Publish repository**:
   - Click "Publish repository"
   - Name: `sciencekit`
   - Keep private: Unchecked
   - Click "Publish Repository"

---

## 🎯 Success Checklist

- [ ] Git installed and working
- [ ] Git user configured
- [ ] Repository initialized (`git init`)
- [ ] Files added (`git add .`)
- [ ] First commit created (`git commit`)
- [ ] GitHub repository created at github.com
- [ ] Remote origin added (`git remote add`)
- [ ] Code pushed to GitHub (`git push`)
- [ ] Verified on github.com/YOUR_USERNAME/sciencekit

---

## 📞 Need Help?

### GitHub Documentation:
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [First-time Git setup](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git)
- [Adding existing project to GitHub](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)

### Common Commands Reference:
```cmd
# Status check
git status

# Add files
git add filename.ts
git add .  # All files

# Commit
git commit -m "Message"

# Push
git push origin main

# Pull updates
git pull origin main

# View history
git log --oneline
```

---

## 🚀 Next Step: Environment Variables

Once GitHub setup is complete, proceed to **Step 2: Environment Variables Setup**.

**Quick command to continue:**
```cmd
cd "c:\Users\rajsi\OneDrive\Desktop\my web"
# Run the deployment script
deploy-step-by-step.bat
# Choose option 3 for Environment Variables
```

---

## ✅ Step 1 Complete!

Your ScienceKit.in code is now safely stored on GitHub. This provides:
- **Backup** of your code
- **Version control** to track changes
- **Deployment** capability to Vercel
- **Collaboration** ability with others

**Repository URL:** `https://github.com/YOUR_USERNAME/sciencekit`

**Next:** Configure environment variables for deployment.