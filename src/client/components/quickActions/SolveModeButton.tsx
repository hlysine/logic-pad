import { memo } from 'react';
import { useGrid } from '../../contexts/GridContext';
import { instance as musicGridInstance } from '@logic-pad/core/data/rules/musicGridRule';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { FaStarHalfAlt } from 'react-icons/fa';

export default memo(function SolveModeButton() {
  const { grid } = useGrid();
  const navigate = useNavigate();
  const routerState = useRouterState();
  if (grid.findRule(r => r.id === musicGridInstance.id)) return null;
  return (
    <button
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip="Switch to solve mode"
      onClick={async () => {
        await navigate({
          to: routerState.location.pathname.replace('/perfection', '/solve'),
          search: routerState.location.search,
        });
      }}
    >
      <FaStarHalfAlt size={24} />
    </button>
  );
});
