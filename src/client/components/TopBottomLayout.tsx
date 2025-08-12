import { memo } from 'react';

export interface TopBottomLayoutProps {
  top: React.ReactNode;
  children: React.ReactNode;
}

export default memo(function TopBottomLayout({
  top,
  children,
}: TopBottomLayoutProps) {
  return (
    <div className="flex flex-col flex-1 self-center w-full max-w-[1000px] px-4 md:px-12">
      <div className="flex-shrink-0 flex flex-col gap-4">{top}</div>
      <div className="divider"></div>
      <div className="grow overflow-y-auto">{children}</div>
    </div>
  );
});
