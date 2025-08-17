import { memo } from 'react';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default memo(function ResponsiveLayout({
  children,
}: ResponsiveLayoutProps) {
  return (
    <div className="flex flex-col flex-1 self-center items-center w-full px-4 md:px-12 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[calc(320px*3+1rem*2+1rem*2)] md:max-w-[calc(320px*3+1rem*2+3rem*2)] gap-4 mb-8 shrink-0">
        {children}
      </div>
    </div>
  );
});
