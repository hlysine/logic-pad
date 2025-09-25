import { memo } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { FaStarHalfAlt } from 'react-icons/fa';

export default memo(function SolveModeButton() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const search = useRouterState({ select: s => s.location.search });
  return (
    <Link
      to={pathname.replace('/perfection', '/solve')}
      search={search}
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip="Switch to perfection mode"
    >
      <FaStarHalfAlt size={24} />
    </Link>
  );
});
