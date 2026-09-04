# Messaging and asynchronous feedback

Choose feedback by scope, urgency, persistence, and whether the user must act.

| Situation | Use | Live behavior | Content rule |
| --- | --- | --- | --- |
| Invalid field | Field error | Associate with the control; announce on validation | State the problem and correction |
| Several invalid fields | `ds-validation-summary` plus field errors | Alert after failed submit; links should move focus | Summarize without replacing field detail |
| Section-specific state | `ds-alert` | Warning/danger may be assertive; otherwise polite | Name the affected section and next step |
| System-wide risk or outage | `ds-banner` or `ds-maintenance-notice` | Persistent; assert only when immediate | Explain impact, timing, and recovery/action |
| Background confirmation | `ds-toast` in `ds-toast-region` | Polite and time-limited | Confirm the action; never hide critical work here |
| No data | `ds-empty-state` with optional `ds-illustration` | No unsolicited announcement on initial page load | Explain why it is empty and the best next action |
| Initial wait | `ds-loading-state` or skeleton composition | Announce only if the wait lasts at least 750ms | Use a task-specific label |
| Measurable work | `ds-progress` | Announce meaningful milestones, not every increment | Name the process and completion state |

Preserve user-entered data after a failed request. Do not show the same message simultaneously in a
toast, banner, and inline alert. Success that is already obvious in the viewport does not need an
extra notification.

Messages use sentence case, plain language, and specific verbs. Titles are short; descriptions state
impact and the next step. Destructive outcomes and unsaved data require persistent feedback.
