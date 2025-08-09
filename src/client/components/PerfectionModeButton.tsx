import { memo } from 'react';
import { useGrid } from '../contexts/GridContext';
import { instance as musicGridInstance } from '@logic-pad/core/data/rules/musicGridRule';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { FaStar } from 'react-icons/fa';

export default memo(function PerfectionModeButton() {
  const { grid } = useGrid();
  const navigate = useNavigate();
  const routerState = useRouterState();
  if (grid.findRule(r => r.id === musicGridInstance.id)) return null;
  return (
    <button
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip="Switch to perfection mode"
      onClick={async () => {
        await navigate({
          to: '/perfection',
          search: routerState.location.search,
        });
      }}
    >
      <FaStar size={24} />
    </button>
  );
});
