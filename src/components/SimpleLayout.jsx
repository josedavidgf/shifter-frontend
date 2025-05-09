import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SimpleLayout() {
  const location = useLocation();

  return (
    <main style={{ flex: 1, overflowY: 'auto' }}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.div>
    </main>
  );
}
