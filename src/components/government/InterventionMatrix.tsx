// ============================================================
// FILE: src/components/government/InterventionMatrix.tsx
// PURPOSE: Wrapper for the intervention priority scatter matrix
// DEPENDS ON: src/lib/types.ts, src/components/charts/PriorityMatrix.tsx
// ============================================================

'use client';

import type { InterventionItem } from '@/lib/types';
import PriorityMatrix from '@/components/charts/PriorityMatrix';

interface InterventionMatrixProps {
  interventions: InterventionItem[];
}

/**
 * Section displaying the priority matrix for government officers,
 * mapping interventions by impact vs. feasibility.
 */
export default function InterventionMatrix({ interventions }: InterventionMatrixProps) {
  return (
    <section>
      <PriorityMatrix interventions={interventions} title="Intervention Priority Matrix" />
    </section>
  );
}