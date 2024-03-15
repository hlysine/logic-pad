export interface GridOverlayProps {
  children?: React.ReactNode;
}

export default function GridOverlay({ children }: GridOverlayProps) {
  return <div className="absolute inset-0 pointer-events-none">{children}</div>;
}
