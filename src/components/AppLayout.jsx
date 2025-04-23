import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import ProfileButton from './ProfileButton';
import { motion } from 'framer-motion';


export default function AppLayout() {
    return (
        <div className="app-shell">
            <header>
                <ProfileButton />
            </header>
            <main>
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
        </div>
    );
}
