import '@endeavoury/finance-design/styles.css';
import '@endeavoury/finance-design/button';
import '@endeavoury/finance-design/forms';
import '@endeavoury/finance-design/display';
import '@endeavoury/finance-design/feedback';
import '@endeavoury/finance-design/layout';

document.querySelector('main')!.innerHTML = `
  <ds-container size="narrow">
    <ds-stack gap="6">
      <ds-page-header eyebrow="Vanilla example" heading="No framework required" description="These are the same shipped custom elements used by React, Angular, and Storybook."></ds-page-header>
      <form id="profile-form">
        <ds-stack>
          <ds-input name="name" label="Display name" value="Vanilla consumer" required></ds-input>
          <ds-checkbox name="updates" checked>Receive updates</ds-checkbox>
          <ds-button type="submit">Save profile</ds-button>
        </ds-stack>
      </form>
      <ds-alert id="result" tone="success" heading="Ready">Submit the native form to verify ElementInternals.</ds-alert>
    </ds-stack>
  </ds-container>`;
document.querySelector('#profile-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget as HTMLFormElement);
  document.querySelector('#result')!.textContent =
    `Submitted: ${JSON.stringify(Object.fromEntries(data))}`;
});
