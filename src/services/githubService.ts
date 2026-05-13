import type { PlayerState } from '../hooks/usePlayerState';
import type { UploadQueueItem } from './dailyLogService';
import { getGithubToken } from './secureConfig';

export interface UploadPendingResult {
  state: PlayerState;
  attempted: number;
  succeeded: number;
  failed: number;
  pending: number;
  skippedReason?: string;
}

function bytesToBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i];
    const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const combined = (byte1 << 16) | (byte2 << 8) | byte3;

    output += chars[(combined >> 18) & 63];
    output += chars[(combined >> 12) & 63];
    output += i + 1 < bytes.length ? chars[(combined >> 6) & 63] : '=';
    output += i + 2 < bytes.length ? chars[combined & 63] : '=';
  }

  return output;
}

function toBase64Utf8(input: string): string {
  if (typeof TextEncoder !== 'undefined') {
    return bytesToBase64(new TextEncoder().encode(input));
  }

  const escaped = unescape(encodeURIComponent(input));
  const bytes = new Uint8Array(escaped.length);
  for (let i = 0; i < escaped.length; i += 1) {
    bytes[i] = escaped.charCodeAt(i);
  }
  return bytesToBase64(bytes);
}

async function readGithubErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.message) return data.message;
  } catch {
    // Fall through to text body.
  }

  try {
    const text = await res.text();
    if (text) return text;
  } catch {
    // Fall through to generic message.
  }

  return `GitHub API request failed with status ${res.status}.`;
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function putMarkdownFile(
  owner: string,
  repo: string,
  token: string,
  item: UploadQueueItem,
): Promise<{ fileUrl?: string }> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(item.path)}`;
  let sha: string | undefined;

  const checkRes = await fetch(url, {
    headers: githubHeaders(token),
  });

  if (checkRes.ok) {
    const data = await checkRes.json();
    sha = data.sha;
  } else if (checkRes.status !== 404) {
    throw new Error(await readGithubErrorMessage(checkRes));
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: `ARISE log sync: ${item.title}`,
      content: toBase64Utf8(item.content),
      sha,
    }),
  });

  if (!putRes.ok) {
    throw new Error(await readGithubErrorMessage(putRes));
  }

  const data = await putRes.json();
  return { fileUrl: data?.content?.html_url || data?.content?.download_url };
}

export async function uploadPendingLogItems(state: PlayerState): Promise<UploadPendingResult> {
  const pendingItems = (state.uploadQueue || []).filter(item => item.status !== 'uploaded');
  if (pendingItems.length === 0) {
    return { state, attempted: 0, succeeded: 0, failed: 0, pending: 0 };
  }

  const config = state.githubConfig;
  if (!config?.owner || !config.repo) {
    return {
      state,
      attempted: 0,
      succeeded: 0,
      failed: 0,
      pending: pendingItems.length,
      skippedReason: 'GitHub owner and repository are not configured.',
    };
  }

  const token = await getGithubToken();
  if (!token) {
    return {
      state,
      attempted: 0,
      succeeded: 0,
      failed: 0,
      pending: pendingItems.length,
      skippedReason: 'GitHub token is not configured in secure storage.',
    };
  }

  let attempted = 0;
  let succeeded = 0;
  let failed = 0;
  const now = new Date().toISOString();
  const nextQueue: UploadQueueItem[] = [...(state.uploadQueue || [])];

  for (const item of pendingItems) {
    const index = nextQueue.findIndex(entry => entry.id === item.id);
    if (index < 0 || nextQueue[index].status === 'uploaded') continue;

    attempted += 1;
    try {
      await putMarkdownFile(config.owner, config.repo, token, item);
      succeeded += 1;
      nextQueue[index] = {
        ...nextQueue[index],
        status: 'uploaded',
        attempts: (nextQueue[index].attempts || 0) + 1,
        uploadedAt: now,
        lastAttemptAt: now,
        lastError: undefined,
      };
    } catch (err: unknown) {
      failed += 1;
      const message = err instanceof Error ? err.message : 'Unknown upload error';
      nextQueue[index] = {
        ...nextQueue[index],
        status: 'failed',
        attempts: (nextQueue[index].attempts || 0) + 1,
        lastAttemptAt: now,
        lastError: message,
      };
    }
  }

  const nextState: PlayerState = {
    ...state,
    uploadQueue: nextQueue,
    dailyLogs: (state.dailyLogs || []).map(log => {
      const uploaded = nextQueue.find(item => item.id === log.id && item.status === 'uploaded');
      const failedItem = nextQueue.find(item => item.id === log.id && item.status === 'failed');
      if (uploaded) return { ...log, uploadStatus: 'uploaded', uploadedAt: uploaded.uploadedAt, uploadError: undefined };
      if (failedItem) return { ...log, uploadStatus: 'failed', uploadError: failedItem.lastError };
      return log;
    }),
    phaseLogs: (state.phaseLogs || []).map(log => {
      const uploaded = nextQueue.find(item => item.id === log.id && item.status === 'uploaded');
      const failedItem = nextQueue.find(item => item.id === log.id && item.status === 'failed');
      if (uploaded) return { ...log, uploadStatus: 'uploaded', uploadedAt: uploaded.uploadedAt, uploadError: undefined };
      if (failedItem) return { ...log, uploadStatus: 'failed', uploadError: failedItem.lastError };
      return log;
    }),
  };

  return {
    state: nextState,
    attempted,
    succeeded,
    failed,
    pending: nextQueue.filter(item => item.status !== 'uploaded').length,
  };
}
