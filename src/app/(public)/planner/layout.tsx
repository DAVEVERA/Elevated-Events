import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan een kennismaking',
  description:
    'Plan een kennismaking met Gabriela Mihalcea van Elevated Eventmaker voor eventbranding, styling en merkbeleving van zakelijke events.',
  alternates: { canonical: '/planner' },
};

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
