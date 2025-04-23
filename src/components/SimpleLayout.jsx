import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SimpleLayout() {
  return (
    <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </main>
  );
}
