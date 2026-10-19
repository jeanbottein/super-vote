import { ApiError } from '../api/client';
import type { Messages } from './en';

type Problem = keyof Messages['problems'];

/**
 * A sentence for the person using the app, whatever went wrong, in their
 * language. The server explains a refusal in English; the web app words it
 * from the problem's type, the part that is contract, and shows the server's
 * own sentence only for a type it has no words for (invalid-request: which
 * rule was broken is in that sentence, and the forms check the rules first).
 */
export function errorMessage(error: unknown, t: Messages): string {
  if (!(error instanceof ApiError)) {
    return t.errors.unexpected;
  }
  if (error.status === 0) {
    return t.errors.unreachable;
  }
  const problem = error.type?.replace(/^\/problems\//, '');
  if (problem !== undefined && isWorded(problem, t)) {
    const worded = t.problems[problem];
    return typeof worded === 'function'
      ? worded(t.waitUntil(Date.now() + (error.retryAfter ?? 0) * 1000))
      : worded;
  }
  return error.message || t.errors.failed(error.status);
}

function isWorded(problem: string, t: Messages): problem is Problem {
  return Object.hasOwn(t.problems, problem);
}
