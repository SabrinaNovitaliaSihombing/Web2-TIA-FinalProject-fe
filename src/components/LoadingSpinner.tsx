import { motion } from 'framer-motion';

const spinnerVariants = {
    initial: {
        rotate: 0,
    },
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                variants={spinnerVariants}
                initial="initial"
                animate="animate"
            />
        </div>
    );
};

export default LoadingSpinner; 