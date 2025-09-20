import { queryOptions, useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { api } from './api';
import Loading from '../components/Loading';
import { cn } from '../uiHelper';

export const avatarQueryOptions = (userId?: string | null) =>
  queryOptions({
    queryKey: ['avatar', userId],
    queryFn: () => (userId ? api.getAvatar(userId) : null),
    enabled: !!userId,
    staleTime: Infinity,
  });

export interface AvatarProps {
  userId?: string | null;
  username?: string | null;
  className?: string;
}

export default memo(function Avatar({
  userId,
  username,
  className,
}: AvatarProps) {
  const { isPending, data } = useQuery(avatarQueryOptions(userId));

  if (isPending) {
    return <Loading className={cn('shrink-0', className)} />;
  }
  return (
    <img
      src={data ?? undefined}
      alt={`${username}'s avatar`}
      className={cn('rounded-full shrink-0', className)}
    />
  );
});
