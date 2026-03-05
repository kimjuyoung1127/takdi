/** Client-side typed fetch wrappers for all Takdi API endpoints. */

type JsonBody = Record<string, unknown> | object;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

function post<T>(url: string, body?: JsonBody): Promise<T> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function patch<T>(url: string, body: JsonBody): Promise<T> {
  return request<T>(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Project ---

export interface CreateProjectData {
  name?: string;
  mode?: string;
  briefText?: string;
  templateKey?: string;
}

export function createProject(data: CreateProjectData) {
  return post<{ id: string }>("/api/projects", data);
}

// --- Content ---

export interface UpdateContentData {
  content?: string;
  briefText?: string;
  mode?: string;
  templateKey?: string;
}

export function updateContent(projectId: string, data: UpdateContentData) {
  return patch<{ id: string }>(`/api/projects/${projectId}/content`, data);
}

// --- Generate (text) ---

export interface AsyncJobResponse {
  jobId: string;
  status: string;
}

export interface JobPollResponse {
  job: { id: string; status: string; error?: string; startedAt?: string; doneAt?: string };
  [key: string]: unknown;
}

export function startGenerate(projectId: string, opts?: { provider?: string; apiKey?: string }) {
  return post<AsyncJobResponse>(`/api/projects/${projectId}/generate`, opts);
}

export function pollGenerate(projectId: string, jobId: string) {
  return get<JobPollResponse>(`/api/projects/${projectId}/generate?jobId=${jobId}`);
}

// --- Generate Images ---

export function startGenerateImages(
  projectId: string,
  opts?: { slots?: string[]; apiKey?: string; aspectRatio?: string; styleParams?: Record<string, string> },
) {
  return post<AsyncJobResponse>(`/api/projects/${projectId}/generate-images`, opts);
}

export function pollGenerateImages(projectId: string, jobId: string) {
  return get<JobPollResponse>(`/api/projects/${projectId}/generate-images?jobId=${jobId}`);
}

// --- Remotion Render ---

export function startRender(projectId: string, opts?: { compositionId?: string; templateKey?: string }) {
  return post<AsyncJobResponse>(`/api/projects/${projectId}/remotion/render`, opts);
}

export function pollRenderStatus(projectId: string) {
  return get<{ jobId: string; status: string; artifact?: unknown }>(
    `/api/projects/${projectId}/remotion/status`,
  );
}

// --- Preview ---

export function setupPreview(projectId: string, templateKey: string) {
  return post<{ compositionId: string; inputProps: unknown; previewReady: boolean }>(
    `/api/projects/${projectId}/remotion/preview`,
    { templateKey },
  );
}

// --- Export ---

export function startExport(projectId: string, opts?: { type?: string }) {
  return post<AsyncJobResponse>(`/api/projects/${projectId}/export`, opts);
}

export function pollExport(projectId: string, jobId: string) {
  return get<JobPollResponse>(`/api/projects/${projectId}/export?jobId=${jobId}`);
}

// --- Assets ---

export function uploadAsset(
  projectId: string,
  file: File,
  opts?: { sourceType?: string; preserveOriginal?: boolean },
) {
  const form = new FormData();
  form.append("file", file);
  if (opts?.sourceType) form.append("sourceType", opts.sourceType);
  if (opts?.preserveOriginal) form.append("preserveOriginal", "true");
  return request<{ asset: { id: string; filePath: string }; validation?: unknown }>(
    `/api/projects/${projectId}/assets`,
    { method: "POST", body: form },
  );
}

// --- BGM ---

export function uploadBgm(projectId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{ asset: { id: string; filePath: string }; analysis?: unknown }>(
    `/api/projects/${projectId}/bgm`,
    { method: "POST", body: form },
  );
}

// --- Cuts Handoff ---

export function cutHandoff(projectId: string, data: { selectedImageId: string; preserveOriginal?: boolean }) {
  return post<{ project: unknown; selectedAsset: unknown }>(`/api/projects/${projectId}/cuts/handoff`, data);
}

// --- Usage ---

export interface UsageSummary {
  workspaceId: string;
  summary: {
    totalEvents: number;
    generationCount: number;
    exportCount: number;
    totalEstimatedCost: number;
  };
  entries: unknown[];
}

export function fetchUsage() {
  return get<UsageSummary>("/api/usage/me");
}
