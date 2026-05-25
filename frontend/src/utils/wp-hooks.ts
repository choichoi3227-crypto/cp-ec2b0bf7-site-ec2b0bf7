// wp-hooks.ts — 자동 변환: WordPress add_action/add_filter → TypeScript 이벤트 시스템
type HookCallback = (...args: unknown[]) => unknown;
const _actions: Record<string, HookCallback[]> = {};
const _filters: Record<string, HookCallback[]> = {};

// add_action() 변환
export function addAction(hook: string, callback: HookCallback): void {
  (_actions[hook] ??= []).push(callback);
}
// do_action() 변환
export function doAction(hook: string, ...args: unknown[]): void {
  (_actions[hook] ?? []).forEach(cb => cb(...args));
}
// add_filter() 변환
export function addFilter(hook: string, callback: HookCallback): void {
  (_filters[hook] ??= []).push(callback);
}
// apply_filters() 변환
export function applyFilters(hook: string, value: unknown, ...args: unknown[]): unknown {
  return (_filters[hook] ?? []).reduce((v, cb) => cb(v, ...args), value);
}
