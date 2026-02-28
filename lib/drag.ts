/** Attach pointer/mouse move listeners for a drag gesture. */
export const startDrag = (
  e: React.PointerEvent | React.MouseEvent,
  onMove: (clientX: number, clientY: number) => void,
): void => {
  e.preventDefault();
  e.stopPropagation();

  if ("pointerId" in e) {
    const pointerId = e.pointerId;

    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      ev.preventDefault();
      onMove(ev.clientX, ev.clientY);
    };

    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return;
  }

  const move = (ev: MouseEvent) => onMove(ev.clientX, ev.clientY);
  const up = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  };

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
};
