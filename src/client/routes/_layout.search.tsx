import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { puzzleSearchSchema } from '../online/PuzzleSearchQuery';

export const Route = createFileRoute('/_layout/search')({
  validateSearch: zodValidator(puzzleSearchSchema),
});
