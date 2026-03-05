---
name: async-job-pattern
description: Pattern for async long-running tasks with GenerationJob polling in Takdi.
---

## Trigger
- Use when adding long-running API operations (image generation, video render, etc.).
- Use when implementing fire-and-forget background processing with status polling.

## Read First
1. `src/app/api/projects/[id]/generate-images/route.ts` — canonical implementation
2. `prisma/schema.prisma` — GenerationJob model
3. `src/lib/api-response.ts` — response helpers

## Pattern

### POST Handler (Start Job)
```typescript
// 1. Validate project + workspace scope
// 2. Status guard (appropriate project state)
// 3. Create GenerationJob in transaction
const job = await prisma.$transaction(async (tx) => {
  const newJob = await tx.generationJob.create({
    data: {
      projectId: id,
      status: "queued",
      provider: "provider-name",
      input: JSON.stringify({ /* params */ }),
    },
  });
  await tx.usageLedger.create({
    data: {
      workspaceId,
      eventType: "event_type_start",
      detail: JSON.stringify({ projectId: id, jobId: newJob.id }),
    },
  });
  return newJob;
});

// 4. Fire-and-forget background processing
processInBackground(job.id, /* params */).catch(console.error);

// 5. Return 202 immediately
return jsonOk({ jobId: job.id, status: "queued" }, 202);
```

### Background Processing Function
```typescript
async function processInBackground(jobId: string, /* params */) {
  try {
    // Mark running
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "running", startedAt: new Date() },
    });

    // Do work...
    const result = await doExpensiveWork();

    // Mark done
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "done",
        output: JSON.stringify(result),
        doneAt: new Date(),
      },
    });
  } catch (error) {
    // Mark failed — always capture error
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "failed", error: String(error), doneAt: new Date() },
    });
  }
}
```

### GET Handler (Poll Status)
```typescript
// 1. Validate jobId query param
// 2. Verify project ownership + workspace scope
// 3. Fetch job, return status
// 4. If "done", include result data (assets, artifacts, etc.)
// 5. If "failed", include error message
return jsonOk({
  job: { id, status, provider, error, startedAt, doneAt },
  ...(status === "done" ? { assets } : {}),
});
```

## Job Status Lifecycle
```
queued → running → done
                 → failed
```

## Key Rules
- Always create job in a transaction with UsageLedger
- Always use fire-and-forget with `.catch(console.error)` — never await in request handler
- Always update job status at each transition (queued → running → done/failed)
- Always capture error string in job.error on failure
- Return 202 (Accepted), not 200, for async operations
- Process items sequentially in background to respect rate limits

## Validation
- POST returns 202 with jobId immediately
- GET returns current job status with appropriate data
- Failed jobs have error field populated
- UsageLedger has start event recorded
