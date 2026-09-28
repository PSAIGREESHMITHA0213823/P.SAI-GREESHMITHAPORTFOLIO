import { createStore } from './store';

/** Global overlay state: command palette and shortcuts help. */
export const paletteStore = createStore(false);
export const shortcutsStore = createStore(false);

export const openPalette = () => paletteStore.set(true);
export const closePalette = () => paletteStore.set(false);
