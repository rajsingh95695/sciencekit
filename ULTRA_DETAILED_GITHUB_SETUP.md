# ULTRA DETAILED GitHub Setup Guide - Step by Step with Screenshots (Textual)

## 📋 Table of Contents
1. [Prerequisites Checklist](#prerequisites-checklist)
2. [Git Installation Verification](#git-installation-verification)
3. [GitHub Account Setup](#github-account-setup)
4. [Project Folder Navigation](#project-folder-navigation)
5. [Git Repository Initialization](#git-repository-initialization)
6. [Git Configuration](#git-configuration)
7. [Staging Files](#staging-files)
8. [Committing Changes](#committing-changes)
9. [Creating GitHub Repository](#creating-github-repository)
10. [Connecting Local to Remote](#connecting-local-to-remote)
11. [Pushing Code to GitHub](#pushing-code-to-github)
12. [Verifying Push](#verifying-push)
13. [Troubleshooting Every Possible Error](#troubleshooting-every-possible-error)
14. [Common Mistakes & Solutions](#common-mistakes--solutions)
15. [Video Tutorial Style Instructions](#video-tutorial-style-instructions)

---

## 1. Prerequisites Checklist ✅

### What you need BEFORE starting:
- [ ] Windows 10/11 computer
- [ ] Internet connection
- [ ] GitHub account (free)
- [ ] Git installed
- [ ] Your project at: `c:\Users\rajsi\OneDrive\Desktop\my web`
- [ ] Command Prompt access

### Time required: 15-20 minutes

---

## 2. Git Installation Verification 🔍

### Step 2.1: Open Command Prompt
**EXACT METHOD 1 (Recommended):**
1. Press `Windows Key + R` simultaneously
2. Type `cmd` in the Run dialog
3. Press `Enter`

**EXACT METHOD 2 (Alternative):**
1. Click Windows Start button (bottom left)
2. Type "Command Prompt"
3. Click on "Command Prompt" app

**EXACT METHOD 3 (As Administrator - if needed):**
1. Right-click Windows Start button
2. Select "Windows Terminal (Admin)" or "Command Prompt (Admin)"
3. Click "Yes" if User Account Control appears

### Step 2.2: Check Git Version
In the Command Prompt window, type exactly:
```cmd
git --version
```

### Step 2.3: Interpret Results

**✅ SUCCESSFUL OUTPUT (Git is installed):**
```
git version 2.45.0.windows.1
```
*(Your version number may differ slightly)*

**❌ ERROR OUTPUT 1 (Git not found):**
```
'git' is not recognized as an internal or external command,
operable program or batch file.
```

**❌ ERROR OUTPUT 2 (Path issues):**
```
Command not found
```

### Step 2.4: If Git is NOT Installed

**DOWNLOAD GIT:**
1. Open browser (Chrome/Edge)
2. Go to: https://git-scm.com/download/win
3. Click "Download for Windows"
4. File will be: `Git-2.45.0-64-bit.exe` (or similar)

**INSTALL GIT (Step by Step):**
1. Double-click the downloaded `.exe` file
2. Click "Yes" if User Account Control appears
3. **License Agreement:** Click "Next"
4. **Select Destination Location:** Click "Next" (use default)
5. **Select Components:** Keep all checked, click "Next"
6. **Choose Start Menu Folder:** Click "Next"
7. **Choosing Default Editor:** Select "Use Visual Studio Code as Git's default editor" or "Nano" if you prefer
8. **Adjusting PATH Environment:**
   - **CRITICAL:** Select "Git from the command line and also from 3rd-party software"
   - This adds Git to your PATH
9. **Choosing HTTPS Transport:** Select "Use the OpenSSL library"
10. **Configuring Line Endings:** Select "Checkout Windows-style, commit Unix-style line endings"
11. **Configuring Terminal Emulator:** Select "Use Windows' default console window"
12. **Extra Options:** Keep defaults, click "Install"
13. Wait for installation to complete
14. Click "Finish"

**VERIFY INSTALLATION AGAIN:**
1. Close ALL Command Prompt windows
2. Open NEW Command Prompt
3. Type: `git --version`
4. Should show version number

---

## 3. GitHub Account Setup 🐙

### Step 3.1: Create GitHub Account (if you don't have one)

**VISUAL GUIDE (Text Description):**
1. Open browser
2. Go to: https://github.com/signup
3. You'll see:
   ```
   Welcome to GitHub
   Let's begin the adventure
   
   Email address: [___________]
   Password: [___________]
   Username: [___________]
   [ ] Send me product updates and announcements via email
   Verify your account
   Type the text: [___________]
   Create account
   ```
4. Fill details:
   - Email: Your personal email
   - Password: Strong password (mix of letters, numbers, symbols)
   - Username: `ScienceKitIndia` or similar (available name)
5. Complete CAPTCHA
6. Click "Create account"

### Step 3.2: Verify Email
1. Check your email inbox
2. Look for email from "GitHub"
3. Click "Verify email address" button
4. You'll be redirected to GitHub dashboard

### Step 3.3: Sign In (if already have account)
1. Go to: https://github.com/login
2. Enter username/email and password
3. Click "Sign in"
4. Complete 2FA if enabled

---

## 4. Project Folder Navigation 📁

### Step 4.1: Open Command Prompt in EXACT Location

**METHOD A: Direct Navigation**
```cmd
cd "c:\Users\rajsi\OneDrive\Desktop\my web"
```

**EXPECTED OUTPUT:**
```
C:\Users\rajsi\OneDrive\Desktop\my web>
```

**METHOD B: Step-by-Step Navigation**
```cmd
cd \
cd Users
cd rajsi
cd OneDrive
cd Desktop
cd "my web"
```

**VERIFY YOU'RE IN CORRECT FOLDER:**
```cmd
dir
```

**EXPECTED OUTPUT (Partial):**
```
 Volume in drive C is Windows
 Volume Serial Number is XXXX-XXXX

 Directory of c:\Users\rajsi\OneDrive\Desktop\my web

04/23/2026  09:45 AM    <DIR>          .
04/23/2026  09:45 AM    <DIR>          ..
04/23/2026  09:30 AM             1,234 package.json
04/23/2026  09:30 AM               567 next.config.ts
04/23/2026  09:30 AM    <DIR>          app
04/23/2026  09:30 AM    <DIR>          components
04/23/2026  09:30 AM    <DIR>          lib
               2 File(s)          1,801 bytes
               5 Dir(s)  250,000,000,000 bytes free
```

**IF YOU SEE DIFFERENT FILES:** You're in wrong folder. Use `cd ..` to go back and try again.

---

## 5. Git Repository Initialization 🚀

### Step 5.1: Initialize Git Repository

**COMMAND:**
```cmd
git init
```

**✅ SUCCESSFUL OUTPUT:**
```
Initialized empty Git repository in C:/Users/rajsi/OneDrive/Desktop/my web/.git/
```

**❌ ERROR OUTPUT 1 (Already initialized):**
```
Reinitialized existing Git repository in C:/Users/rajsi/OneDrive/Desktop/my web/.git/
```
*(This is OK - means Git was already initialized)*

**❌ ERROR OUTPUT 2 (Permission denied):**
```
fatal: could not create work tree dir 'C:/Users/rajsi/OneDrive/Desktop/my web/.git': Permission denied
```
*(Run Command Prompt as Administrator)*

### Step 5.2: Verify .git Folder Created

**COMMAND:**
```cmd
dir /a
```

**LOOK FOR:**
```
04/23/2026  09:46 AM    <DIR>          .git
```

**ALTERNATIVE CHECK:**
```cmd
ls -la
```
*(If you have Git Bash or WSL)*

---

## 6. Git Configuration ⚙️

### Step 6.1: Set Your Name

**COMMAND:**
```cmd
git config --global user.name "Your Name"
```

**EXAMPLE:**
```cmd
git config --global user.name "Raj Singh"
```

### Step 6.2: Set Your Email

**COMMAND:**
```cmd
git config --global user.email "your.email@example.com"
```

**EXAMPLE:**
```cmd
git config --global user.email "raj@sciencekit.in"
```

**IMPORTANT:** Use SAME email as your GitHub account

### Step 6.3: Verify Configuration

**COMMAND:**
```cmd
git config --list
```

**EXPECTED OUTPUT:**
```
user.name=Raj Singh
user.email=raj@sciencekit.in
core.autocrlf=true
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
```

### Step 6.4: Set Default Branch Name

**COMMAND:**
```cmd
git config --global init.defaultBranch main
```

---

## 7. Staging Files 📦

### Step 7.1: Check Current Status

**COMMAND:**
```cmd
git status
```

**EXPECTED OUTPUT (Red text - untracked files):**
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .env.example
        .gitignore
        components.json
        deploy-step-by-step.bat
        deploy.bat
        DEPLOYMENT_COMPARISON.md
        DEPLOYMENT_GUIDE.md
        eslint.config.mjs
        FULL_DEPLOYMENT_GUIDE.md
        next-env.d.ts
        next.config.ts
        package-lock.json
        package.json
        POST_DEPLOYMENT_CHECKLIST.md
        postcss.config.mjs
        proxy.ts
        QUICK_DEPLOY.md
        README.md
        app/
        components/
        config/
        constants/
        context/
        hooks/
        lib/
        models/
        public/
        scripts/
        services/
        styles/
        types/

nothing added to commit but untracked files present (use "git add" to track)
```

### Step 7.2: Add ALL Files to Staging

**COMMAND (Add everything):**
```cmd
git add .
```

**ALTERNATIVE (Add specific files):**
```cmd
git add package.json next.config.ts app/ components/ lib/
```

**VERIFY FILES ARE STAGED:**
```cmd
git status
```

**EXPECTED OUTPUT (Green text - staged files):**
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .env.example
        new file:   .gitignore
        new file:   components.json
        new file:   deploy-step-by-step.bat
        new file:   deploy.bat
        new file:   DEPLOYMENT_COMPARISON.md
        new file:   DEPLOYMENT_GUIDE.md
        new file:   eslint.config.mjs
        new file:   FULL_DEPLOYMENT_GUIDE.md
        new file:   next-env.d.ts
        new file:   next.config.ts
        new file:   package-lock.json
        new file:   package.json
        new file:   POST_DEPLOYMENT_CHECKLIST.md
        new file:   postcss.config.mjs
        new file:   proxy.ts
        new file:   QUICK_DEPLOY.md
        new file:   README.md
        new file:   app/error.tsx
        new file:   app/globals.css
        ... (many more files)
```

---

## 8. Committing Changes 💾

### Step 8.1: Create First Commit

**COMMAND:**
```cmd
git commit -m "Initial commit: ScienceKit.in e-commerce website"
```

**✅ SUCCESSFUL OUTPUT:**
```
[main (root-commit) a1b2c3d] Initial commit: ScienceKit.in e-commerce website
 234 files changed, 56789 insertions(+)
 create mode 100644 .env.example
 create mode 100644 .gitignore
 create mode 100644 components.json
 ... (list continues)
```

**❌ ERROR OUTPUT 1 (No files staged):**
```
On branch main

nothing to commit, working tree clean
```
*(Run `git add .` first)*

**❌ ERROR OUTPUT 2 (No user configured):**
```
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
```
*(Configure your name and email as in Step 6)*

### Step 8.2: Verify Commit

**COMMAND:**
```cmd
git log --oneline
```

**EXPECTED OUTPUT:**
```
a1b2c3d (HEAD -> main) Initial commit: ScienceKit.in e-commerce website
```

---

## 9. Creating GitHub Repository 🌐

### Step 9.1: Create New Repository on GitHub

**VISUAL GUIDE (Text Description):**

1. **Sign in to GitHub** (https://github.com)
2. **Click "+" icon** (top right corner)
3. **Select "New repository"**
4. **Repository creation page appears:**
   ```
   Create a new repository
   
   Owner: [YourUsername] ▼
   Repository name: [sciencekit-in]
   
   Description (optional): [ScienceKit.in - E-commerce for Science Kits]
   
   [ ] Public
   [ ] Private
   
   [ ] Add a README file
   [ ] Add .gitignore
   [ ] Choose a license
   
   Create repository
   ```
5. **Fill details:**
   - Repository name: `sciencekit-in`
   - Description: `ScienceKit.in - E-commerce for Science Kits`
   - Select: **Public** (for free hosting)
   - UNCHECK: "Add a README file" (you already have one)
   - UNCHECK: "Add .gitignore" (you already have one)
   - UNCHECK: "Choose a license"
6. **Click "Create repository"**

### Step 9.2: Copy Repository URL

**AFTER CREATION, you'll see:**
```
Quick setup — if you've done this kind of thing before

https://github.com/YourUsername/sciencekit-in.git

We recommend every repository include a README, LICENSE, and .gitignore.

…or create a new repository on the command line

echo "# sciencekit-in" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YourUsername/sciencekit-in.git
git push -u origin main

…or push an existing repository from the command line

git remote add origin https://github.com/YourUsername/sciencekit-in.git
git branch -M main
git push -u origin main

…or import code from another repository

You can initialize this repository with code from a Subversion, Mercurial, or TFS project.
```

**COPY THIS URL:**
```
https://github.com/YourUsername/sciencekit-in.git
```

**REPLACE `YourUsername` with YOUR actual GitHub username**

---

## 10. Connecting Local to Remote 🔗

### Step 10.1: Add Remote Repository

**COMMAND (Replace with YOUR URL):**
```cmd
git remote add origin https://github.com/YourUsername/sciencekit-in.git
```

**EXAMPLE (If username is "ScienceKitIndia"):**
```cmd
git remote add origin https://github.com/ScienceKitIndia/sciencekit-in.git
```

### Step 10.2: Verify Remote

**COMMAND:**
```cmd
git remote -v
```

**✅ SUCCESSFUL OUTPUT:**
```
origin  https://github.com/ScienceKitIndia/sciencekit-in.git (fetch)
origin  https://github.com/ScienceKitIndia/sciencekit-in.git (push)
```

**❌ ERROR OUTPUT (Wrong URL):**
```
origin  https://github.com/wrong-username/sciencekit-in.git (fetch)
origin  https://github.com/wrong-username/sciencekit-in.git (push)
```

**TO FIX WRONG URL:**
```cmd
git remote remove origin
git remote add origin https://github.com/CorrectUsername/sciencekit-in.git
```

---

## 11. Pushing Code to GitHub 🚀

### Step 11.1: Push to GitHub

**COMMAND:**
```cmd
git push -u origin main
```

**✅ SUCCESSFUL OUTPUT:**
```
Enumerating objects: 567, done.
Counting objects: 100% (567/567), done.
Delta compression using up to 8 threads
Compressing objects: 100% (456/456), done.
Writing objects: 100% (567/567), 2.34 MiB | 1.23 MiB/s, done.
Total 567 (delta 123), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (123/123), done.
To https://github.com/ScienceKitIndia/sciencekit-in.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Step 11.2: If Branch Name is Different

**CHECK CURRENT BRANCH:**
```cmd
git branch
```

**IF IT SAYS "master" INSTEAD OF "main":**
```cmd
git branch -M main
git push -u origin main
```

---

## 12. Verifying Push ✅

### Step 12.1: Check GitHub Website

1.