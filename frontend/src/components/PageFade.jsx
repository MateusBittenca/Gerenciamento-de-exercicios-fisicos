import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { EASE } from '../motion';

export default function PageFade() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Outlet />
    </motion.div>
  );
}
