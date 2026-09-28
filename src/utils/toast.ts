import { createStore } from './store';

export interface Toast {
  id: number;
  message: string;
  tone: 'default' | 'success' | 'error';
}

export const toastStore = createStore<Toast[]>([]);
let seq = 0;

export function toast(message: string, tone: Toast['tone'] = 'default') {
  const id = ++seq;
  toastStore.set((list) => [...list.slice(-2), { id, message, tone }]);
  window.setTimeout(() => toastStore.set((list) => list.filter((t) => t.id !== id)), 3200);
}
