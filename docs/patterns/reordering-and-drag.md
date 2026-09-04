# Reordering and drag-and-drop

`ds-reorder-list` and `ds-reorder-item` provide pointer dragging plus visible earlier/later controls.
Consumers receive `ds-reorder` with the moved value, source and destination indexes, and new order.

## Requirements

- Dragging is never the only way to perform the operation.
- Every move control includes the item name in its accessible name.
- The original item remains visible and muted while dragging.
- The final position is announced and focus returns to the moved item.
- The UI updates optimistically; persistence failure restores the old order and explains the failure.
- Trees with complex parent/child moves should open a Move dialog listing valid destinations rather
  than relying on directional keys alone.
- File drop zones always retain a native file-input path.

Use a visible handle when reordering is primary. When it is secondary, an action menu may contain Move
earlier/later or Move to… actions. Do not hide the only alternative until hover.

For board and tree implementations, show a 2px placement indicator and a selected-background cue.
Close an overlay owned by the dragged item when the drag begins. Announce the item name, old location,
new location, and position after a completed move.
