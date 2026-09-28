import { toast } from './toast';

export async function copyText(text: string, label = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
    toast(label, 'success');
  } catch {
    toast('Copy failed — select and copy manually', 'error');
  }
}
