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

## Usage

### Global configuration

**By doing this, all repositories will use the global hooks even if they have git hooks configured.**
```bash
# Setting global hooks path
git config --local core.hooksPath ~/githooks/

# Copy the tripauthor hooks to the global hooks path
cp script ~/githooks/

# Set access permissions so that the scripts can be executed by Git
chmod a+x ~/githooks/*
```

### Husky

```bash
echo "yarn tripauthor -f $1" > .husky/commit-msg

chmod a+x .husky/commit-msg
```

## Add more coauthors

```bash
echo "name <email>" >> ~/.git_coauthors
```