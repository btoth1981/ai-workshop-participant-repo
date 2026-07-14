<!-- BEGIN:nextjs-agent-rules -->
# Next.js: always read the version-matched docs before coding

Before any Next.js work, find and read the relevant documentation in
`node_modules/next/dist/docs/`. The installed documentation is the source of
truth for this project's Next.js version.
<!-- END:nextjs-agent-rules -->

# Agent rules

Starter for a small website built with AI-assisted development
(Next.js App Router + TypeScript + Tailwind + shadcn/ui).

## Rules

1. Follow `DESIGN-GUIDELINE.md` for anything visual.
2. UI building blocks come from `src/components/ui/` (shadcn/ui — local source,
   you may edit it). Add new ones with `npx shadcn@latest add <component>`.
3. Keep it simple: no new libraries, patterns, or abstractions unless the task
   truly needs them. One implementation ⇒ no interface.
4. Code, comments, and commit messages are English.
5. Before declaring any task done, run and fix until green:
   `npm run typecheck && npm run lint && npm run test`
6. Human-facing documentation (`docs/spec/`, `workshop-evidence/`, briefs) is
   written in Hungarian; agent-facing instruction files (this file,
   `docs/engineering-standards.md`) plus code, comments and commits stay
   English (see rule 4).
7. Commit and push only on an explicit human request — never autonomously.
8. Feature work starts only from the approved spec package in `docs/spec/`.
   Each task is a Linear issue (project: `ai-workshop-participant-repo`,
   team Stressballs); work happens on a feature branch and ends with a PR
   and green gates.
9. Evidence over claims: every statement of fact is backed by the exact
   command and its observed output. Evidence files live in
   `workshop-evidence/` and follow the fixed template: purpose / what the
   agent may assume / what it may not assume / verification blocks
   (command → expected → actual → VERIFIED or UNKNOWN + decision owner) /
   unknowns / role boundaries / next human decision.
10. Unknown means undecided, not free rein: an empty guideline section, a
    missing spec or an unreachable resource is an OPEN human decision —
    name the decision owner and stop, never invent the answer.
11. Role boundaries: the model proposes; the coding agent executes and
    proves within the approved scope; the human owns scope, approvals and
    gates; an independent reviewer (second harness / CI) verifies — the
    maker never validates its own work.
12. Follow `docs/engineering-standards.md` — the canonical checklist for
    makers, fixers and reviewers. Link to it, never copy it into prompts.
    Toolkit source for station packages: `../workshop-source/toolkit/`.

> This file grows during the workshop — every recurring correction you give
> the agent belongs here as a rule.
