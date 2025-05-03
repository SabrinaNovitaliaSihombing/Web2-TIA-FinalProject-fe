import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from './LoadingOverlay';

interface CategoryFormProps {
    isEdit?: boolean;
}

interface FormData {
    nama: string;
    warna: string;
}

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

const inputVariants = {
    focus: {
        scale: 1.02,
        transition: {
            duration: 0.2,
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

const CategoryForm = ({ isEdit = false }: CategoryFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormData>({
        nama: '',
        warna: '#000000',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            const fetchCategory = async () => {
                try {
                    const response = await categoryApi.getCategoryById(Number(id));
                    setFormData({
                        nama: response.data.nama,
                        warna: response.data.warna,
                    });
                } catch (err) {
                    setError('Failed to fetch category');
                }
            };
            fetchCategory();
        }
    }, [isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEdit && id) {
                await categoryApi.updateCategory(parseInt(id), formData);
            } else {
                await categoryApi.createCategory(formData);
            }
            navigate('/categories');
        } catch (err) {
            setError('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="container mx-auto px-4 py-8"
            >
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-800 mb-6"
                >
                    {isEdit ? 'Edit Category' : 'Create New Category'}
                </motion.h1>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                            Name
                        </label>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type="text"
                            id="nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="warna">
                            Color
                        </label>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-4"
                        >
                            <input
                                type="color"
                                id="warna"
                                value={formData.warna}
                                onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                                className="h-10 w-20 rounded cursor-pointer"
                            />
                            <motion.div
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: formData.warna }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            />
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 mb-4"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                        </motion.button>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="button"
                            onClick={() => navigate('/categories')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.form>
            </motion.div>
        </>
    );
};

export default CategoryForm; 