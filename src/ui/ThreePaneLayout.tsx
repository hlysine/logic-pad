import { memo } from 'react';

export interface ThreePaneLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  center: React.ReactNode;
}

export default memo(function ThreePaneLayout({
  left,
  right,
  center,
}: ThreePaneLayoutProps) {
  return (
    <div className="flex flex-1 justify-center items-center flex-wrap xl:flex-nowrap gap-2">
      <div className="w-full xl:w-[320px] shrink-0 grow-0 flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
        {left}
      </div>
      <div className="grow shrink overflow-auto self-stretch p-8">
        <div className="flex items-center justify-center m-0 p-0 border-0 min-h-full min-w-full h-fit w-fit">
          {center}
        </div>
      </div>
      <div className="w-[320px] shrink-0 grow-0 min-h-[50vh] flex flex-col items-end self-stretch justify-stretch">
        <div className="w-[320px] h-full flex flex-col items-stretch justify-center gap-4">
          {right}
        </div>
      </div>
    </div>
  );
});
