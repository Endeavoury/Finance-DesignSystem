const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
  'ds-button:not([disabled])',
  'ds-icon-button:not([disabled])',
  'ds-input:not([disabled])',
  'ds-select:not([disabled])',
].join(',');

export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(focusableSelector)].filter(
    (element) =>
      !element.hidden &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.getAttribute('aria-disabled') !== 'true',
  );
}

export function captureFocus(document: Document): () => void {
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  return () => active?.focus({ preventScroll: true });
}

export function announce(
  message: string,
  options: { document?: Document; assertive?: boolean; clearAfter?: number } = {},
): void {
  const document = options.document ?? globalThis.document;
  if (!document?.body) return;
  const id = options.assertive ? 'ds-assertive-announcer' : 'ds-polite-announcer';
  let region = document.getElementById(id);
  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('role', options.assertive ? 'alert' : 'status');
    region.setAttribute('aria-live', options.assertive ? 'assertive' : 'polite');
    region.setAttribute('aria-atomic', 'true');
    Object.assign(region.style, {
      position: 'fixed',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      clipPath: 'inset(50%)',
      whiteSpace: 'nowrap',
    });
    document.body.append(region);
  }
  region.textContent = '';
  globalThis.setTimeout(() => {
    if (region) region.textContent = message;
  }, 20);
  globalThis.setTimeout(() => {
    if (region?.textContent === message) region.textContent = '';
  }, options.clearAfter ?? 5000);
}
