# 2. Refactoring File Inventory & Tracking

This document provides the initial file inventory for the frontend refactoring effort. Use it as a starting point, but track actual progress using **GitHub Issues** - that's the source of truth.

## Tracking Methodology

**THE SOURCE OF TRUTH: GitHub Issues + Projects**

Instead of complex tables, we use GitHub's built-in project management:

### Issue Labels for Tracking
- **`refactor-p0`**: Critical foundation files (types, core utilities)
- **`refactor-p1`**: High-impact infrastructure (20+ usages)
- **`refactor-p2`**: Medium-impact components (5-19 usages)
- **`refactor-p3`**: Low-impact files (1-4 usages)

### Status Labels
- **`status-not-started`**: Initial state
- **`status-in-progress`**: Currently being worked on
- **`status-completed`**: Refactoring finished
- **`status-blocked`**: Waiting on dependencies

### GitHub Projects Board
**Create a board called "Frontend Refactoring" with columns:**
- **Backlog** (not started)
- **In Progress** (actively being worked on)
- **Review** (needs code review)
- **Done** (completed and tested)

### How to Use This System
1. **Create Issues:** For each file that needs refactoring, create a GitHub issue
2. **Apply Labels:** Use the priority and status labels above
3. **Track Progress:** Move issues through the project board
4. **Link PRs:** Reference issues in your PR descriptions

**WHY THIS WORKS BETTER:**
- ✅ **Automatic tracking** - GitHub handles the workflow
- ✅ **Team visibility** - Everyone can see progress
- ✅ **Built-in collaboration** - Comments, assignments, notifications
- ✅ **Flexible** - Easy to add new files or change priorities
- ✅ **Integrated** - Works with your existing GitHub workflow

## Key Files by Priority (Reference Only)

**Use this as a starting point for creating GitHub issues.** The actual tracking happens in GitHub.

---

## File Inventory by Priority

**Create GitHub issues for these files using the priority labels.**

### **P0 (Critical Foundation)**
These break everything if wrong - do first:
- `types/inventory.ts` (19 usages) - Core type definitions

### **P1 (High Impact Infrastructure)**
20+ usages - affects many files:
- `lib/utils.ts` (67 usages) - Most used utility library
- `components/ui/button.tsx` (49 usages) - Base UI component
- `contexts/app-context.tsx` (28 usages) - Global state management
- `hooks/use-toast.ts` (26 usages) - Toast notifications
- `lib/stores/useAuthStore.ts` (22 usages) - Authentication store
- `components/ui/input.tsx` (22 usages) - Form input component
- `components/ui/dialog.tsx` (21 usages) - Modal dialogs

---

### **P2 (Medium Impact Components)**
5-19 usages - refactor in batches:
- `components/ui/card.tsx` (18 usages) - Layout container
- `components/ui/table.tsx` (13 usages) - Data table component
- `types/inventory.ts` (19 usages) - **MOVED TO P0** - Core type definitions

### **P3 (Low Impact Files)**
1-4 usages - safe to refactor:
- `hooks/use-debounce.ts` (1 usage) - Debouncing utility
- `hooks/use-device.tsx` - Device detection
- `hooks/use-keyboard-shortcuts.tsx` - Keyboard shortcuts
- `hooks/use-navigation.tsx` - Navigation utilities
- `lib/particle-presets.ts` - UI animation presets
- `lib/document-storage.ts` - Document storage utilities
- `lib/mocks/inventory-mock-data.ts` - Mock data
- `components/inventory/grouped-inventory-table.tsx` (1 usage) - Main table component

## Additional Files to Track

**Create GitHub issues for these categories:**
- **API Services**: `lib/api/client.ts`, `lib/api/inventory.ts`, `lib/api/auth.ts`
- **Business Logic Hooks**: `hooks/use-pending-tasks.tsx`, `hooks/useInventory.ts`
- **Core Pages**: All `app/(app)/*/page.tsx` files (inventory, tasks, assignments, etc.)
- **Complex Components**: Bulk operation modals, document manager, task editing
- **Loading States**: All `loading.tsx` files
- **Remaining Components**: ~80 other components with 1-4 usages each

## Quick Start Guide

1. **Create GitHub Issues** for each file using the priority labels above
2. **Use GitHub Projects** board to track progress (Backlog → In Progress → Done)
3. **Start with P0 files** first, then P1, then batch P2 files together
4. **P3 files** can be done in parallel or iteratively

---

## **🎯 Simplified Refactoring Battle Plan**

**Priority Order:** P0 → P1 → P2 → P3

**Success Metrics:**
- ✅ **P0**: Types compile without errors
- ✅ **P1**: Core infrastructure functional (20+ dependents each)
- ✅ **P2**: Business logic working (5-19 dependents each)
- ✅ **P3**: All files updated and tested (1-4 dependents each)

**Key Risk Areas:**
- **P1 files are CRITICAL** - breaking any affects 20+ other files
- **P0 must be perfect** - foundation for all data structures
- **P2 files need coordination** - medium dependencies
- **P3 files are low-risk** - can be batched safely

---

## **Maintenance Notes**

**This is a living reference.** The actual tracking happens in GitHub Issues.

- **Add new files** as GitHub issues when discovered
- **Update priorities** based on new fan-out analysis
- **Move issues** through the project board as work progresses
- **Link PRs** to issues for traceability
