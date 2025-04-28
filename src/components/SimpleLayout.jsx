import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SimpleLayout() {
  return (
    <main style={{ flex: 1, overflowY: 'auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Outlet />
        </motion.div>
    </main>
  );
}
