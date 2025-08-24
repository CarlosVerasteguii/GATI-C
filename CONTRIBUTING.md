# Contribution Guide for GATI-C

This guide describes the development process and conventions to follow when contributing to the GATI-C project.

## Git Workflow

We follow a variant of the [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow adapted to our needs:

### Main Branches

- **main**: Main branch containing production-ready code.
- **develop**: Development branch where completed features are integrated.

### Support Branches

- **feature/feature-name**: For developing new features.
- **fix/problem-name**: For bug fixes.
- **refactor/improvement-name**: For code refactors without changing behavior.
- **docs/documentation-name**: For documentation updates.

### Development Process

1. **Create a branch**: From `develop`, create a new branch according to the type of work:
   ```bash
   # For new features
   git checkout develop
   git pull
   git checkout -b feature/feature-name

   # For bug fixes
   git checkout -b fix/problem-name

   # For refactors
   git checkout -b refactor/improvement-name

   # For documentation
   git checkout -b docs/documentation-name
   ```

2. **Make changes**: Work on your local branch making frequent commits.

3. **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   <type>[optional scope]: <description>

   [optional body]

   [optional footer]
   ```

   Where `<type>` can be:
   - **feat**: New feature
   - **fix**: Bug fix
   - **docs**: Documentation changes
   - **style**: Changes that do not affect code meaning (spacing, formatting, etc.)
   - **refactor**: Code refactor
   - **test**: Add or fix tests
   - **chore**: Changes to the build process or auxiliary tools

   Example:
   ```
   feat(inventory): implement advanced state filter

   - Adds filters for multiple states
   - Implements filter persistence in localStorage
   - Optimizes performance with React.useMemo

   Closes #123
   ```

4. **Pull Request**: When finished:
   - Make sure your branch is up to date with develop
   ```bash
   git checkout develop
   git pull
   git checkout your-branch
   git rebase develop
   ```
   - Push your branch to the repository
   ```bash
   git push -u origin your-branch
   ```
   - Create a Pull Request (PR) via GitHub
   - Assign reviewers

5. **Code Review**:
   - All changes must be reviewed by at least one developer
   - Address all review comments

6. **Merge**:
   - Once approved, the PR is merged into `develop`
   - For releases, `develop` will be merged into `main`

## Code Standards

We follow the standards defined in [.cursorules](/.cursorules) including:

- **TypeScript**: Use strict types
- **React/Next.js**: Conventions for components and hooks
- **Tailwind CSS**: For styling
- **Documentation**: JSDoc for all components

## Tests

- All new features must include unit tests
- PRs will not be approved if tests do not pass

## Updating the CHANGELOG

After each significant set of changes:

1. Update the `CHANGELOG.md` file in the [Unreleased] section
2. When preparing a release, move the changes to a new section with the version number

## Recommended Tools

- Visual Studio Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- Cursor IDE for AI integration
