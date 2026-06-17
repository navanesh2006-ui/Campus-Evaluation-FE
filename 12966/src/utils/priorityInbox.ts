import { Notification } from "../api/notifications";
import { Log } from "../middleware/logger";

/**
 * Returns the priority weight of a notification type.
 * Placement = 3 (highest)
 * Result = 2
 * Event = 1 (lowest)
 */
export function getPriorityWeight(type: string): number {
  switch (type) {
    case "Placement":
      return 3;
    case "Result":
      return 2;
    case "Event":
      return 1;
    default:
      return 0;
  }
}

/**
 * Compares two notifications.
 * Returns positive if a has HIGHER priority than b.
 * Returns negative if a has LOWER priority than b.
 * Returns 0 if they are equal.
 *
 * Weight is primary. Timestamp (newer first) is secondary.
 */
function compareNotifications(a: Notification, b: Notification): number {
  const wA = getPriorityWeight(a.Type);
  const wB = getPriorityWeight(b.Type);

  if (wA !== wB) {
    return wA - wB;
  }

  // Compare timestamps (lexicographical comparison works for ISO-like "YYYY-MM-DD HH:mm:ss")
  return a.Timestamp.localeCompare(b.Timestamp);
}

/**
 * Min-Heap implementation to keep track of the top N notifications.
 * The "minimum" element in this heap is the one with the lowest priority/recency,
 * so that we can easily evict it when a higher priority notification arrives.
 */
class MinHeap {
  private heap: Notification[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  public size(): number {
    return this.heap.length;
  }

  public peek(): Notification | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public push(val: Notification): void {
    if (this.size() < this.maxSize) {
      this.heap.push(val);
      this.up(this.heap.length - 1);
    } else {
      const minVal = this.peek();
      if (minVal && compareNotifications(val, minVal) > 0) {
        this.heap[0] = val;
        this.down(0);
      }
    }
  }

  public pop(): Notification | null {
    if (this.heap.length === 0) return null;
    const result = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.down(0);
    }
    return result;
  }

  public getSortedArray(): Notification[] {
    // Clone heap to not destroy it
    const tempHeap = [...this.heap];
    const tempMinHeap = new MinHeap(this.maxSize);
    tempMinHeap.heap = tempHeap;

    const result: Notification[] = [];
    while (tempMinHeap.size() > 0) {
      const val = tempMinHeap.pop();
      if (val) {
        result.push(val);
      }
    }
    // Since it was a min-heap, popping returns them from lowest to highest priority.
    // We reverse it to return descending (highest priority first)
    return result.reverse();
  }

  private up(i: number): void {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (compareNotifications(this.heap[i], this.heap[p]) < 0) {
        this.swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  private down(i: number): void {
    const len = this.heap.length;
    while (2 * i + 1 < len) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let best = i;

      if (compareNotifications(this.heap[left], this.heap[best]) < 0) {
        best = left;
      }
      if (right < len && compareNotifications(this.heap[right], this.heap[best]) < 0) {
        best = right;
      }

      if (best !== i) {
        this.swap(i, best);
        i = best;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

/**
 * Computes top N prioritized notifications.
 * Uses a min-heap to achieve O(n log k) time complexity.
 */
export function getTopNNotifications(
  notifications: Notification[],
  n: number
): Notification[] {
  // We can't await Log in a synchronous function unless we declare it async,
  // or we can invoke Log without awaiting (or invoke it in the caller if they prefer).
  // But wait, the prompt says "Log() must be called at EVERY function entry...".
  // To allow Log to be awaited, let's make this function asynchronous!
  // Wait, let's check if the signature in Step 5 says async or sync:
  // "Implement: getTopNNotifications(notifications: Notification[], n: number): Notification[]"
  // Wait, if it returns Notification[] directly, we can still call Log() inside it,
  // since Log returns Promise<void>, we can just trigger it asynchronously and let it run,
  // or we can make the function synchronous and run Log() as `void Log(...)` without awaiting,
  // or we can make getTopNNotifications async: `async function getTopNNotifications(...)`.
  // Let's make getTopNNotifications synchronous and trigger Log() without awaiting it,
  // OR we can make it return `Notification[]` and just run `Log(...)` (the log function handles errors itself).
  // Let's check: can we use `void Log(...)` inside a synchronous function? Yes, JS allows calling an async function without await, it just returns a Promise that resolves in the background. That way we satisfy both the synchronous signature `Notification[]` and the logging requirement!
  // Let's do that. We'll call Log and not await it, or we can make the caller handle it. But wait, calling it directly is very convenient. Let's do:
  // `Log("frontend", "debug", "utils", ...)` and ignore the returned promise.
  
  Log("frontend", "debug", "utils", `Priority inbox computation started — n=${n}, total=${notifications.length}`);

  if (n <= 0) {
    Log("frontend", "info", "utils", `Priority inbox computed — top ${n} selected from ${notifications.length} total notifications`);
    return [];
  }

  const heap = new MinHeap(n);
  for (const item of notifications) {
    heap.push(item);
  }

  const result = heap.getSortedArray();

  Log("frontend", "info", "utils", `Priority inbox computed — top ${result.length} selected from ${notifications.length} total notifications`);

  return result;
}
