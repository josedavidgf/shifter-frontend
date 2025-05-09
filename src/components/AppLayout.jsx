import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';


export default function AppLayout() {
    //console.debug('[AppLayout] montado en', window.location.pathname);

    return (
        <>
            <main style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: '76px', // deja espacio para BottomNav
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
