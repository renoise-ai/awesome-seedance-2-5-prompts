const MAX_CONCURRENT = 6;
const SLOT_TIMEOUT_MS = 15_000;
const queue: Array<{ resolve: () => void; priority: number }> = [];
let active = 0;

function processQueue() {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    queue.sort((a, b) => a.priority - b.priority);
    const next = queue.shift();
    if (next) {
      active++;
      next.resolve();
    }
  }
}

export function requestVideoLoad(priority: number): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    queue.push({ resolve, priority });
  });
}

export function releaseVideoSlot() {
  active = Math.max(0, active - 1);
  processQueue();
}

export function scheduleSlotTimeout(): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    releaseVideoSlot();
  }, SLOT_TIMEOUT_MS);
}
