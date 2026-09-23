export const EASE = [0.22, 1, 0.36, 1];
export const DUR = 0.45;

export const tap = { scale: 0.98 };

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR, ease: EASE }
  }
};

export const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 }
  }
};
