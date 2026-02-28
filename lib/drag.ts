/** Attach mousemove/mouseup listeners for a drag gesture. */
export const startDrag = (
  e: React.MouseEvent,
  onMove: (clientX: number, clientY: number) => void,
): void => {
  e.preventDefault();
  e.stopPropagation();

  const move = (ev: MouseEvent) => onMove(ev.clientX, ev.clientY);
  const up = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  };
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
};
