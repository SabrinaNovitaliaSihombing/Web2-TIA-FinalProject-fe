import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi } from '../utils/api';
import { motion } from 'framer-motion';
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
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
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

const CategoryDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await categoryApi.getCategoryById(Number(id));
                setCategory(response.data);
            } catch (err) {
                setError('Failed to fetch category');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryApi.deleteCategory(Number(id));
                navigate('/categories');
            } catch (err) {
                setError('Failed to delete category');
            }
        }
    };

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
    if (!category) return <div className="text-center py-8">Category not found</div>;

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
                    variants={itemVariants}
                    className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 rounded-full mx-auto mb-4"
                        style={{ backgroundColor: category.warna }}
                    />

                    <motion.h1
                        variants={itemVariants}
                        className="text-2xl font-bold text-gray-800 text-center mb-4"
                    >
                        {category.nama}
                    </motion.h1>

                    <motion.div
                        variants={itemVariants}
                        className="text-sm text-gray-500 mb-6"
                    >
                        <p>Created: {new Date(category.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(category.updated_at).toLocaleDateString()}</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center space-x-4"
                    >
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate(`/categories/${id}/edit`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Edit
                        </motion.button>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Delete
                        </motion.button>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate('/categories')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Back
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default CategoryDetail; 