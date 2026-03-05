# automations/

External scheduler prompt assets for Takdi.

## Rules
- Keep prompts deterministic and idempotent.
- Always specify KST schedule and lock policy.
- First execution should be `DRY_RUN=true`.
