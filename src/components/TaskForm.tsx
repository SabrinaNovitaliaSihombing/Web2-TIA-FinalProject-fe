import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskApi, categoryApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from './LoadingOverlay';

interface TaskFormProps {
    isEdit?: boolean;
}

interface FormData {
    judul: string;
    deskripsi: string;
    due_date: string;
    status: boolean;
    category_id: number | null;
}

interface Category {
    id: number;
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

const TaskForm = ({ isEdit = false }: TaskFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormData>({
        judul: '',
        deskripsi: '',
        due_date: '',
        status: false,
        category_id: null,
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAllCategories();
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };

        fetchCategories();

        if (isEdit && id) {
            const fetchTask = async () => {
                try {
                    const response = await taskApi.getTaskById(Number(id));
                    setFormData({
                        judul: response.data.judul,
                        deskripsi: response.data.deskripsi,
                        due_date: response.data.due_date,
                        status: response.data.status,
                        category_id: response.data.category?.id || null,
                    });
                } catch (err) {
                    setError('Failed to fetch task');
                }
            };
            fetchTask();
        }
    }, [isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEdit && id) {
                await taskApi.updateTask(Number(id), formData);
            } else {
                await taskApi.createTask(formData);
            }
            navigate('/tasks');
        } catch (err) {
            setError('Failed to save task');
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
                    {isEdit ? 'Edit Task' : 'Create New Task'}
                </motion.h1>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="judul">
                            Title
                        </label>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type="text"
                            id="judul"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">
                            Description
                        </label>
                        <motion.textarea
                            variants={inputVariants}
                            whileFocus="focus"
                            id="deskripsi"
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
                            Due Date
                        </label>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type="datetime-local"
                            id="due_date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
                            Category
                        </label>
                        <motion.select
                            variants={inputVariants}
                            whileFocus="focus"
                            id="category_id"
                            value={formData.category_id || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })
                            }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nama}
                                </option>
                            ))}
                        </motion.select>
                    </div>

                    <div className="mb-6">
                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                                className="w-5 h-5 rounded text-blue-500 focus:ring-blue-400"
                            />
                            <span className="text-gray-700">Completed</span>
                        </motion.label>
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
                            onClick={() => navigate('/tasks')}
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

export default TaskForm; 