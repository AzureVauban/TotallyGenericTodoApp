# Contributing to DivideNDo

Thanks for taking the time to contribute to **DivideNDo**! This guide outlines the process for contributing effectively and consistently to this project.

---

## Contribution Guidelines

### Who Can Contribute

Anyone is welcome to submit:

- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- UI/UX suggestions

## Branching Strategy

### Rules

- Branches must be descriptive and follow a clear naming pattern.
- Use lowercase letters and hyphens to separate words.

### Naming Convention

Use this format:

```txt
feature/short-description
bugfix/short-description
hotfix/short-description
docs/short-description
```

Example:

```txt
feature/add-task-sorting
bugfix/fix-login-error
hotfix/crash-on-launch
docs/update-readme
```

---

## Commit Message Format

### Commit Rules

- Commits must be clear and specific.
- Use present tense: _"Fix login bug"_, not _"Fixed login bug"_

### Commit Examples

```txt
Fix crash when launching app
Add dark mode support
Update contributing guidelines
```

---

## Pull Requests

### Requirements

- Reference the issue number in the PR description.
- Ensure your branch is up to date with `main`.
- Include a clear description of what the PR does.

### PR Title Example

```txt
Add dark mode toggle to settings screen
```

---

## Code Style and Best Practices

- Follow existing patterns and file structures.
- Use functional components and hooks in React Native.
- Use `Yarn` for package management.
- Avoid large, multi-feature PRs. Split into smaller, testable pieces.
- Run `yarn lint` and fix issues before submitting PRs.
- All newly added features must include inline comments and clear naming.

---

## Testing

- Ensure all screens and features behave correctly across devices.
- Test edge cases (e.g. empty states, error handling).
- If applicable, add unit tests.

---

## What Not To Do

- Don’t commit directly to the `main` or `develop` branch.
- Don’t bypass code reviews.
- Don’t merge PRs without verifying requirements.

---

## Need Help?

If you're unsure about anything, feel free to open a draft PR or ask for clarification in the discussion tab or project chat.
