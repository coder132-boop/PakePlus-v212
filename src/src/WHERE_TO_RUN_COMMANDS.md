# 💻 Where to Run the Commands

## Quick Answer

Run `npm run dev:mobile` in your **terminal** (Mac/Linux) or **command prompt** (Windows) inside your ChoreCore project folder.

---

## Step-by-Step for Different Environments

### 🍎 Mac Users

**Option 1: Using Terminal**

1. **Open Terminal** (Cmd + Space, type "Terminal")
2. **Navigate to your project:**
   ```bash
   cd ~/path/to/chorecore
   ```
3. **Run the command:**
   ```bash
   npm run dev:mobile
   ```

**Option 2: Using VS Code**

1. **Open ChoreCore folder in VS Code**
2. **Open Terminal in VS Code** (Ctrl + ` or View → Terminal)
3. **Run the command:**
   ```bash
   npm run dev:mobile
   ```

### 🪟 Windows Users

**Option 1: Using Command Prompt**

1. **Open Command Prompt** (Windows key, type "cmd")
2. **Navigate to your project:**
   ```cmd
   cd C:\path\to\chorecore
   ```
3. **Run the command:**
   ```cmd
   npm run dev:mobile
   ```

**Option 2: Using PowerShell**

1. **Open PowerShell** (Windows key, type "PowerShell")
2. **Navigate to your project:**
   ```powershell
   cd C:\path\to\chorecore
   ```
3. **Run the command:**
   ```powershell
   npm run dev:mobile
   ```

**Option 3: Using VS Code**

1. **Open ChoreCore folder in VS Code**
2. **Open Terminal in VS Code** (Ctrl + ` or View → Terminal)
3. **Run the command:**
   ```powershell
   npm run dev:mobile
   ```

### 🐧 Linux Users

**Option 1: Using Terminal**

1. **Open Terminal** (Ctrl + Alt + T)
2. **Navigate to your project:**
   ```bash
   cd ~/path/to/chorecore
   ```
3. **Run the command:**
   ```bash
   npm run dev:mobile
   ```

**Option 2: Using VS Code**

1. **Open ChoreCore folder in VS Code**
2. **Open Terminal in VS Code** (Ctrl + ` or View → Terminal)
3. **Run the command:**
   ```bash
   npm run dev:mobile
   ```

---

## Visual Guide: VS Code (Recommended)

### Step 1: Open Project in VS Code

```
File → Open Folder → Select "chorecore" folder → Open
```

### Step 2: Open Integrated Terminal

**Three ways to open:**

1. **Keyboard shortcut:**
   - Mac: `Ctrl + `` (backtick)
   - Windows/Linux: `Ctrl + `` (backtick)

2. **Menu:**
   - Click: `View → Terminal`

3. **Right-click:**
   - Right-click anywhere in file explorer → "Open in Integrated Terminal"

### Step 3: Verify You're in the Right Place

Your terminal should show something like:

```bash
user@computer chorecore %
```

or

```cmd
C:\Users\YourName\chorecore>
```

The key is you should see **"chorecore"** in the path!

### Step 4: Run the Command

```bash
npm run dev:mobile
```

---

## 🎯 What You Should See

After running `npm run dev:mobile`, you should see:

```bash
> chorecore@1.0.0 dev:mobile
> vite --host

  VITE v6.0.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/     ← USE THIS ON YOUR PHONE!
  ➜  press h + enter to show help
```

**Important:** Copy the **Network** URL (e.g., `http://192.168.1.100:5173/`)

---

## 🚫 Common Mistakes

### ❌ Wrong: Running in Random Folder

```bash
user@computer Downloads % npm run dev:mobile
npm error enoent Could not read package.json
```

**Fix:** Navigate to your ChoreCore folder first!

### ❌ Wrong: Not Installing Dependencies

```bash
user@computer chorecore % npm run dev:mobile
npm error Missing script: "dev:mobile"
```

**Fix:** Run `npm install` first!

### ❌ Wrong: Node/npm Not Installed

```bash
command not found: npm
```

**Fix:** Install Node.js from https://nodejs.org/

---

## 📍 How to Find Your Project Folder

### If You Don't Know Where ChoreCore Is:

**Mac/Linux:**
```bash
# Search for the folder
find ~ -name "chorecore" -type d 2>/dev/null

# Or search for package.json
find ~ -name "package.json" -path "*/chorecore/*" 2>/dev/null
```

**Windows (PowerShell):**
```powershell
# Search for the folder
Get-ChildItem -Path C:\ -Filter "chorecore" -Directory -Recurse -ErrorAction SilentlyContinue
```

**Easy way:**
1. Open VS Code
2. Click "File → Open Recent"
3. Look for "chorecore" in the list
4. Open it
5. Open terminal in VS Code

---

## 🔧 Complete Setup from Scratch

If you just downloaded/cloned the project:

### 1. Open Terminal/Command Prompt

### 2. Navigate to Project
```bash
cd /path/to/chorecore
```

### 3. Install Dependencies (First Time Only)
```bash
npm install
```

Wait for it to finish... (may take 1-2 minutes)

### 4. Run Dev Server
```bash
npm run dev:mobile
```

### 5. Copy Network URL

Look for this line:
```
➜  Network: http://192.168.1.100:5173/
```

### 6. Open on Your Phone

- Open Safari or Chrome on phone
- Type the Network URL
- Make sure phone is on same WiFi!

---

## 🎓 Terminal Basics

### Navigate to Folder
```bash
cd /path/to/folder          # Go to folder
cd ..                        # Go up one level
pwd                          # Show current location (Mac/Linux)
cd                           # Show current location (Windows)
```

### List Files
```bash
ls                           # List files (Mac/Linux)
dir                          # List files (Windows)
```

### Check if You're in Right Place
```bash
ls package.json              # Should show package.json (Mac/Linux)
dir package.json             # Should show package.json (Windows)
```

---

## 🆘 Troubleshooting

### "npm: command not found"

**You need to install Node.js:**
1. Go to https://nodejs.org/
2. Download LTS version
3. Install it
4. Restart terminal
5. Try again

### "Cannot find module"

**Run:**
```bash
npm install
```

### "Port 5173 already in use"

**Another dev server is running. Either:**
1. Stop the other server (Ctrl + C)
2. Or use a different port:
   ```bash
   npm run dev:mobile -- --port 3000
   ```

### "Permission denied"

**Mac/Linux:**
```bash
sudo npm run dev:mobile
```

**Windows:**
Run Command Prompt as Administrator

---

## 💡 Pro Tips

### 1. Use VS Code Integrated Terminal

**Why?**
- Already in the right folder
- No need to navigate manually
- Can see code and terminal at once

### 2. Create a Shortcut

**Mac:**
Create an alias in `~/.zshrc` or `~/.bashrc`:
```bash
alias chorecore="cd ~/path/to/chorecore && npm run dev:mobile"
```

**Windows:**
Create a batch file `chorecore.bat`:
```batch
@echo off
cd C:\path\to\chorecore
npm run dev:mobile
```

### 3. Keep Terminal Open

Once you run `npm run dev:mobile`, keep that terminal window open!

The server runs continuously until you stop it (Ctrl + C).

---

## 📱 Next Steps

After running the command:

1. ✅ Terminal shows Network URL
2. ✅ Open phone's browser (Safari/Chrome)
3. ✅ Type Network URL
4. ✅ Make sure on same WiFi
5. ✅ ChoreCore loads!

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│  1. Open VS Code                        │
│  2. Open ChoreCore folder               │
│  3. Press Ctrl + ` (open terminal)      │
│  4. Run: npm run dev:mobile             │
│  5. Copy Network URL                    │
│  6. Open on phone browser               │
└─────────────────────────────────────────┘
```

---

## Still Confused?

**Watch where you are!**

Your terminal prompt shows your current location:

```bash
# ✅ GOOD - You're in the chorecore folder
user@computer chorecore %

# ❌ BAD - You're in the wrong folder
user@computer Downloads %
```

**The word "chorecore" should appear in your terminal prompt!**

---

Need more help? See:
- **[MOBILE_QUICK_START.md](./MOBILE_QUICK_START.md)** - Quick mobile testing
- **[README.md](./README.md)** - Full documentation
- **[QUICK_START.md](./QUICK_START.md)** - Setup guide
