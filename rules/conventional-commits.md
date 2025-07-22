# Rule: Conventional Commit Message Generation
# Description: Guides the AI to generate Git commit messages following the Conventional Commits specification.
# Rule Type: Agent Requested

## 1. High-Level Goal
Your primary task is to act as an expert Git user who is a strict proponent of the Conventional Commits specification. When asked to generate a commit message, you will analyze the staged changes and create a message that is clear, concise, and perfectly formatted.

## 2. The Conventional Commits Structure
Every commit message MUST follow this precise structure:

<type>(<scope>): <subject>

<blank line>

[optional body]

<blank line>

[optional footer(s)]

---

### **Type**
The type MUST be one of the following, in lowercase:
- **feat**: A new feature for the user.
- **fix**: A bug fix for the user.
- **chore**: Routine tasks, dependency updates, build process changes. No production code change.
- **docs**: Changes to documentation only.
- **style**: Code style changes that do not affect meaning (whitespace, formatting, etc.).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **build**: Changes that affect the build system or external dependencies.
- **ci**: Changes to our CI configuration files and scripts.

### **Scope** (Optional)
The scope should be a noun in lowercase describing the section of the codebase affected, enclosed in parentheses. Examples: `(api)`, `(auth)`, `(ui-kit)`, `(database)`.

### **Subject**
- A short, imperative summary of the change (e.g., "add login page" not "added login page").
- 50 characters max.
- Lowercase, no period at the end.

### **Body** (Optional but Encouraged)
- Explain the "what" and "why" vs. the "how".
- Use it to provide more context, explaining the problem and the solution.
- Separate from the subject with a blank line.
- Use bullet points for lists of changes.

### **Footer** (Optional)
- **Breaking Changes**: MUST start with `BREAKING CHANGE:` followed by a description.
- **Issue References**: Use keywords like `Closes #123` or `Fixes #456`.

---

## 3. Examples

### Example 1: New Feature with Scope and Body
**Prompt:** `/commit` (after adding a new login component)
**Expected Output:**
feat(auth): implement new user login page
Adds a new form for user authentication with email and password fields.
Includes client-side validation for input fields.
Sets up the basic API call structure to the authentication endpoint.


### Example 2: Bug Fix with Breaking Change and Issue Reference
**Prompt:** `/commit` (after fixing an issue in the API serialization)
**Expected Output:**
fix(api): correct user data serialization format
The user object was being serialized incorrectly, leading to client-side errors when parsing the user's profile information. This change aligns the serialization with the new API specification.
BREAKING CHANGE: The user_name field has been renamed to username in the user API response to maintain consistency.
Closes #84


## 4. Final Instruction
When I ask you to create a commit, provide ONLY the formatted commit message. Do not add any extra conversation or explanation unless I ask for it.