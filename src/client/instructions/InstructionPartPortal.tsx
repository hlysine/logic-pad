import { ReactNode, useEffect } from 'react';
import { PartPlacement } from './parts/types';
import { useInstructionParts } from '../contexts/InstructionPartsContext';

export interface InstructionPartPortalProps {
  children: ReactNode;
  placement: PartPlacement;
}

export default function InstructionPartPortal({
  placement,
  children,
}: InstructionPartPortalProps) {
  const { addPart, removePart } = useInstructionParts();

  useEffect(() => {
    const part = children;
    addPart(placement, part);
    return () => {
      removePart(placement, part);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, children]);

  return null;
}
