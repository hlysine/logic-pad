import { Suspense, lazy, memo } from 'react';
import Markdown from './Markdown';
import Loading from './Loading';
import { GrNew } from 'react-icons/gr';

export let changelogText: string | null;
export const changelogSections: { title: string; content: string }[] = [];

async function loadChangelog() {
  if (changelogSections.length > 0) return Promise.resolve();
  changelogText = (
    await import('../../../CHANGELOG.md?raw')
  ).default.replaceAll(/\r\n|\r|\n/g, '\n');
  const sectionMatch = /(?:^|\n)# (.*?)\n(.*?)(?=\n#|$)/gs;
  for (const match of changelogText.matchAll(sectionMatch)) {
    changelogSections.push({
      title: match[1].trim(),
      content: match[2].trim(),
    });
  }
}

const ChangelogButton = lazy(async () => {
  await loadChangelog();
  return {
    default: function ChangelogButton() {
      return (
        <>
          <button
            type="button"
            aria-label="View changelog"
            className="btn btn-ghost flex flex-col flex-nowrap justify-center items-stretch gap-8 text-left p-4 h-fit border-y border-x-0 border-accent"
            onClick={() =>
              (
                document.getElementById('changelogModal') as HTMLDialogElement
              ).showModal()
            }
          >
            <div className="flex gap-4 items-center flex-wrap">
              <GrNew size={24} className="text-accent" />
              <h3 className="font-bold text-xl">New updates</h3>
              <span>{changelogSections[0].title}</span>
              <div className="flex-1"></div>
              <span className="opacity-80">View changelog &gt;&gt;</span>
            </div>
            <div className="max-h-[5.5rem] text-ellipsis overflow-hidden">
              <Markdown>{changelogSections[0].content}</Markdown>
            </div>
          </button>
          <dialog id="changelogModal" className="modal">
            <div className="modal-box text-base-content">
              <form method="dialog">
                <button
                  aria-label="Close dialog"
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-2xl">Changelog</h3>
              <Markdown>{changelogText!}</Markdown>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button aria-label="Close dialog">close</button>
            </form>
          </dialog>
        </>
      );
    },
  };
});

export default memo(function Changelog() {
  return (
    <div className="min-h-48 w-full mt-16 shrink-0 flex flex-col items-stretch">
      <Suspense fallback={<Loading />}>
        <ChangelogButton />
      </Suspense>
    </div>
  );
});
