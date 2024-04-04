import { memo } from 'react';

export interface HorizontalLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  center: React.ReactNode;
}

export default memo(function HorizontalLayout({
  left,
  right,
  center,
}: HorizontalLayoutProps) {
  return (
    <div className="flex flex-1 justify-center items-center flex-wrap">
      <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
        {left}
      </div>
      <div className="grow shrink flex justify-start items-center p-0">
        <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
          {center}
        </div>
      </div>
      <div className="flex flex-col items-stretch self-stretch justify-center gap-4">
        {right}
      </div>
    </div>
  );
});
