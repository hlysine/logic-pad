import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

const searchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(['logic', 'underclued', 'pattern', 'music']).optional(),
  size: z.enum(['s', 'm', 'l']).optional(),
  minDiff: z.number().min(1).max(10).optional(),
  maxDiff: z.number().min(1).max(10).optional(),
  sort: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_layout/search')({
  validateSearch: zodValidator(searchSchema),
});
