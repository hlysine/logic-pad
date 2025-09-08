import { memo } from 'react';
import { useGrid } from '../../contexts/GridContext';
import { instance as musicGridInstance } from '@logic-pad/core/data/rules/musicGridRule';
import { useNavigate } from '@tanstack/react-router';
import { FaStarHalfAlt } from 'react-icons/fa';
import { router } from '../../router/router';

export default memo(function SolveModeButton() {
  const { grid } = useGrid();
  const navigate = useNavigate();
  if (grid.findRule(r => r.id === musicGridInstance.id)) return null;
  return (
    <button
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip="Switch to solve mode"
      onClick={async () => {
        await navigate({
          to: router.state.location.pathname.replace('/perfection', '/solve'),
          search: router.state.location.search,
        });
      }}
    >
      <FaStarHalfAlt size={24} />
    </button>
  );
});
