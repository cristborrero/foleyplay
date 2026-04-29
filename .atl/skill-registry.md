# Agent Skill Registry

This registry tracks all available agent skills and coding standards for this project.

## Available Skills

| Name | Description | Trigger |
|------|-------------|---------|
| _shared | Internal shared references for SDD skills. Not an invokable skill. | |
| branch-pr | PR creation workflow for Agent Teams Lite following the issue-first enforcement system. | When creating a pull request, opening a PR, or preparing changes for review. |
| go-testing | Go testing patterns for Gentleman.Dots, including Bubbletea TUI testing. | When writing Go tests, using teatest, or adding test coverage. |
| issue-creation | Issue creation workflow for Agent Teams Lite following the issue-first enforcement system. | When creating a GitHub issue, reporting a bug, or requesting a feature. |
| sdd-apply | Implement tasks from the change, writing actual code following the specs and design. | When the orchestrator launches you to implement one or more tasks from a change. |
| sdd-archive | Sync delta specs to main specs and archive a completed change. | When the orchestrator launches you to archive a change after implementation and verification. |
| sdd-design | Create technical design document with architecture decisions and approach. | When the orchestrator launches you to write or update the technical design for a change. |
| sdd-explore | Explore and investigate ideas before committing to a change. | When the orchestrator launches you to think through a feature, investigate the codebase, or clarify requirements. |
| sdd-init | Initialize Spec-Driven Development context in any project. Detects stack, conventions, testing capabilities, and bootstraps the active persistence backend. | When user wants to initialize SDD in a project, or says "sdd init", "iniciar sdd", "openspec init". |
| sdd-onboard | Guided end-to-end walkthrough of the SDD workflow using the real codebase. | When the orchestrator launches you to onboard a user through the full SDD cycle. |
| sdd-propose | Create a change proposal with intent, scope, and approach. | When the orchestrator launches you to create or update a proposal for a change. |
| sdd-spec | Write specifications with requirements and scenarios (delta specs for changes). | When the orchestrator launches you to write or update specs for a change. |
| sdd-tasks | Break down a change into an implementation task checklist. | When the orchestrator launches you to create or update the task breakdown for a change. |
| sdd-verify | Validate that implementation matches specs, design, and tasks. | When the orchestrator launches you to verify a completed (or partially completed) change. |
| skill-creator | Creates new AI agent skills following the Agent Skills spec. | When user asks to create a new skill, add agent instructions, or document patterns for AI. |

## Project Standards (Compact Rules)

No project-specific standards (`agents.md`, `.cursorrules`, etc.) were found in the workspace root.
