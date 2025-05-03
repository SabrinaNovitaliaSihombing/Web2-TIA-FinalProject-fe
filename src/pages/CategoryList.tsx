import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryApi } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

interface Category {
    id: number;
    nama: string;
    warna: string;
    created_at: string;
    updated_at: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
    exit: { opacity: 0, y: -20 },
    hover: {
        scale: 1.02,
        transition: {
            type: 'spring',
            stiffness: 400,
        },
    },
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            type: 'spring',
            stiffness: 400,
        },
    },
    tap: {
        scale: 0.95,
    },
};

const CategoryList = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAllCategories();
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);


    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="container mx-auto px-4 py-8"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/categories/new')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Add Category
                    </motion.button>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                custom={index}
                                whileHover="hover"
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{category.nama}</h2>
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: category.warna }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                    <p>Created: {new Date(category.created_at).toLocaleDateString()}</p>
                                    <p>Updated: {new Date(category.updated_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Link
                                            to={`/categories/${category.id}`}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            View
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Link
                                            to={`/categories/${category.id}/edit`}
                                            className="text-green-500 hover:text-green-600"
                                        >
                                            Edit
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
};

export default CategoryList; 