'use client';

import { Coffee } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * A lighthearted "cups of coffee" stat, seeded from the current day so it
 * feels alive without pretending to be real tracked telemetry (this app has
 * no coffee-tracking backend). Purely decorative footer personality.
 */
export function CoffeeCounter() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const cups = 800 + (dayOfYear % 60) * 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center gap-2 text-xs text-faint"
      title="An estimate, not a live counter — nobody's tracking my caffeine intake."
    >
      <Coffee size={13} className="text-accent-300" strokeWidth={1.5} />
      <span className="tabular-nums">~{cups.toLocaleString()}</span>
      <span>cups of coffee fueling this site</span>
    </motion.div>
  );
}
