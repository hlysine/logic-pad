import { memo } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import AnimationToggle from './settings/AnimationToggle';
import ResetSite from './settings/ResetSite';
import ExitConfirmationToggle from './settings/ExitConfirmationToggle';
import PrimaryMouseButtonToggle from './settings/PrimaryMouseButtonToggle';
import WrapAroundVisualizationToggle from './settings/WrapAroundVisualizationToggle';

export default memo(function Settings() {
  return (
    <div
      className="tooltip tooltip-info tooltip-bottom"
      data-tip="Open settings"
    >
      <button
        type="button"
        aria-label="Open settings"
        className="btn"
        onClick={() =>
          (
            document.getElementById('settingsModal') as HTMLDialogElement
          ).showModal()
        }
      >
        <IoSettingsOutline size={20} />
      </button>
      <dialog id="settingsModal" className="modal">
        <div className="modal-box flex flex-col items-center gap-4">
          <div className="flex flex-col gap-4 max-w-[350px] w-full">
            <AnimationToggle />
            <ExitConfirmationToggle />
            <PrimaryMouseButtonToggle />
            <WrapAroundVisualizationToggle />
          </div>
          <div className="modal-action self-stretch">
            <form method="dialog" className="flex w-full justify-between gap-4">
              <ResetSite />

              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
});
