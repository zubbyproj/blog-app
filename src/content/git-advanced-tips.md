---
title: "Git Advanced Tips and Techniques"
date: "2024-02-08"
excerpt: "Master advanced Git techniques to improve your version control workflow"
imageUrl: "/images/git-advanced.jpg"
---

# Git Advanced Tips and Techniques

Take your Git skills to the next level with these advanced techniques and best practices.

## Advanced Git Commands

Essential advanced commands:

```bash
# View detailed history with file changes
git log --stat

# Search commit history
git log --grep="bug fix"

# Show commits by author
git log --author="John Doe"

# Show branch history in graph format
git log --graph --oneline --decorate --all

# Show who changed each line
git blame filename.js

# Find which commit introduced a bug
git bisect start
git bisect bad HEAD
git bisect good commit-hash
```

## Interactive Rebase

Clean up commit history:

```bash
# Start interactive rebase
git rebase -i HEAD~3

# Commands available in interactive rebase
pick 1234567 First commit
reword 2345678 Second commit
squash 3456789 Third commit
fixup 4567890 Fourth commit
drop 5678901 Fifth commit
```

Example of squashing commits:

```bash
# Before rebase
git log --oneline
a123456 Fix typo
b234567 Update tests
c345678 Add new feature
d456789 Initial commit

# After rebase (squashing the last 3 commits)
git rebase -i HEAD~3

# Result
git log --oneline
e123456 Add new feature with tests
d456789 Initial commit
```

## Advanced Branching

Manage complex branch structures:

```bash
# Create and switch to feature branch
git switch -c feature/new-feature

# Update feature branch with main
git switch feature/new-feature
git rebase main

# Cherry-pick specific commits
git cherry-pick commit-hash

# Create a branch from a specific commit
git switch -c hotfix/bug-fix commit-hash
```

## Git Hooks

Automate workflows with Git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Run tests before commit
npm test

# Run linter
npm run lint

# Check for debug statements
if grep -r "console.log" ./src; then
  echo "Error: Debug statements found"
  exit 1
fi

exit 0
```

```bash
# .git/hooks/prepare-commit-msg
#!/bin/bash

# Add branch name to commit message
BRANCH_NAME=$(git symbolic-ref --short HEAD)
COMMIT_MSG_FILE=$1

# Prepend branch name to commit message
sed -i.bak -e "1s/^/[$BRANCH_NAME] /" $COMMIT_MSG_FILE
```

## Git Worktrees

Work on multiple branches simultaneously:

```bash
# Create a new worktree
git worktree add ../feature-branch feature/new-feature

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../feature-branch
```

## Advanced Git Configuration

Customize Git behavior:

```bash
# .gitconfig
[alias]
  # Custom log format
  lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
  
  # Show changed files
  files = !git diff --name-status $(git merge-base HEAD \"$REVIEW_BASE\")
  
  # Clean merged branches
  cleanup = !git branch --merged | grep -v \"\\*\" | xargs -n 1 git branch -d

[core]
  # Use custom diff tool
  editor = code --wait
  pager = delta

[delta]
  # Enhanced diff viewing
  plus-style = "syntax #012800"
  minus-style = "syntax #340001"
  navigate = true

[merge]
  # Use custom merge tool
  tool = vscode

[mergetool "vscode"]
  cmd = code --wait $MERGED
```

## Git Submodules

Manage project dependencies:

```bash
# Add a submodule
git submodule add https://github.com/user/repo.git libs/repo

# Initialize submodules after cloning
git submodule update --init --recursive

# Update all submodules
git submodule update --remote

# Remove a submodule
git submodule deinit libs/repo
git rm libs/repo
```

## Git Reflog

Recover lost commits:

```bash
# View reflog
git reflog

# Recover deleted branch
git checkout -b recovered-branch HEAD@{2}

# Undo reset
git reset --hard HEAD@{1}
```

## Advanced Merging

Handle complex merges:

```bash
# Merge with specific strategy
git merge feature-branch -X theirs

# Create a merge commit without fast-forward
git merge --no-ff feature-branch

# Abort a merge with conflicts
git merge --abort

# Show merge conflicts in detail
git diff --check
```

## Git Attributes

Configure file handling:

```gitattributes
# .gitattributes
*.js    diff=javascript
*.html  diff=html
*.css   diff=css

# Custom diff for lockfiles
package-lock.json -diff
yarn.lock -diff

# Force line endings
*.sh text eol=lf
*.bat text eol=crlf

# Handle binary files
*.png binary
*.jpg binary
```

## Best Practices

1. **Commit Messages**
   - Use conventional commits
   - Write descriptive messages
   - Reference issues

```bash
# Conventional commit format
<type>(<scope>): <description>

# Examples
feat(auth): add OAuth2 authentication
fix(api): handle null response from server
docs(readme): update installation instructions
```

2. **Branch Management**
   - Use feature branches
   - Keep branches short-lived
   - Delete merged branches

3. **Code Review**
   - Create focused PRs
   - Review commit by commit
   - Use draft PRs for WIP

## Git Workflows

Implement advanced workflows:

```bash
# Feature Branch Workflow
git switch -c feature/new-feature
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature

# Gitflow Workflow
git switch develop
git switch -c feature/new-feature
# ... work on feature
git switch develop
git merge feature/new-feature
git switch main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0"
```

## Conclusion

Mastering these advanced Git techniques will help you manage complex projects more effectively and recover from mistakes more easily. Remember to always use the right tool for the job and maintain a clean, organized repository. 