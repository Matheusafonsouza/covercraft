interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ children, className = "" }: Props) {
  return (
    <div className={`bg-canvas-surface border border-canvas-border rounded-xl p-4 mb-3.5 ${className}`}>
      {children}
    </div>
  );
}
