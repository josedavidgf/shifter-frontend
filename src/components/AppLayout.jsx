import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';


export default function AppLayout() {
    return (
        <>
            <main style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: '72px', // deja espacio para BottomNav
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                >
                    <Outlet />
                </motion.div>
            </main>
            <footer>
                <BottomNav />
            </footer>
        </>
    );
}
