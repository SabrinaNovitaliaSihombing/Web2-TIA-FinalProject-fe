import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const overlayVariants = {
    initial: { backdropFilter: 'blur(0px)' },
    animate: { backdropFilter: 'blur(5px)' },
    exit: { backdropFilter: 'blur(0px)' },
};

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-[5px]  flex items-center justify-center z-50"
                    variants={overlayVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-4">
                        <LoadingSpinner />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-700"
                        >
                            Loading...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingOverlay; 