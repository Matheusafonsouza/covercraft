export default function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="block text-[10px] font-semibold tracking-widest uppercase text-ink-muted mb-1.5">
      {children}
    </span>
  );
}
