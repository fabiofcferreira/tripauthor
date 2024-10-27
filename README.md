# tripauthor

A streamlined Git hook utility for managing commit co-authors that seamlessly integrates with your existing Git 
workflow.

## Installation

```bash
# Install tripauthor globally
npm install -g tripauthor

# Initialize tripauthor in your Git repository
npm add --save-dev tripauthor
yarn add --dev tripauthor
```

## Configuration

### Global hooks

**By doing this, all repositories will use the global hooks even if they have git hooks configured.**
```bash
# Setting global hooks path
git config --local core.hooksPath ~/githooks/

# Copy the tripauthor hooks to the global hooks path
# Use `yarn` if you've installed tripauthor locally
echo "exec < /dev/tty && npx tripauthor -f $1` >> ~/githooks/commit-msg

# Set access permissions so that the scripts can be executed by Git
chmod a+x ~/githooks/*
```

### Husky

```bash
echo "exec < /dev/tty && yarn tripauthor -f $1" > .husky/commit-msg
chmod a+x .husky/commit-msg
```

## Usage

### Set up new co-author

```bash
npx tripauthor add <name> <email>

# alias
npx tripauthor a <name> <email>
```

### List configured co-authors

```bash
npx tripauthor list

# alias
npx tripauthor l
```