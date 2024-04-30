import { createFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import PuzzleEditor from '../ui/editor/PuzzleEditor';

export const Route = createFileRoute('/_layout/create')({
  validateSearch,
  component: memo(function CreateMode() {
    const params = Route.useSearch();
    useLinkLoader(params, true);

    return <PuzzleEditor />;
  }),
});
