# Git Setup and Push Instructions

## Step 1: Initialize Git Repository (if not already initialized)

In your WSL terminal, navigate to the project directory:
```bash
cd /mnt/c/Users/finally/Desktop/chipherschools
```

## Step 2: Initialize Git (if needed)

```bash
git init
```

## Step 3: Add Remote Repository

```bash
git remote add origin https://github.com/subhmishra90/CipherSchools.git
```

If the remote already exists, update it:
```bash
git remote set-url origin https://github.com/subhmishra90/CipherSchools.git
```

## Step 4: Stage All Files

```bash
git add .
```

## Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: CipherSQLStudio - SQL learning platform"
```

## Step 6: Set Default Branch (if needed)

```bash
git branch -M main
```

## Step 7: Push to GitHub

```bash
git push -u origin main
```

If you encounter authentication issues, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys
- Use GitHub CLI

## Alternative: Using GitHub CLI (if installed)

```bash
gh repo create CipherSchools --public --source=. --remote=origin --push
```

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/subhmishra90/CipherSchools.git
```

### If you need to authenticate:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token as your password when pushing

### If you want to use SSH instead:
```bash
git remote set-url origin git@github.com:subhmishra90/CipherSchools.git
```

