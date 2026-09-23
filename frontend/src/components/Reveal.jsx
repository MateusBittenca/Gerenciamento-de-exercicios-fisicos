import { motion } from 'motion/react';
import { DUR, EASE, staggerParent } from '../motion';

export default function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  amount = 0.22,
  stagger = false
}) {
  const Tag = motion[as] || motion.div;

  if (stagger) {
    return (
      <Tag
        className={className}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DUR, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
