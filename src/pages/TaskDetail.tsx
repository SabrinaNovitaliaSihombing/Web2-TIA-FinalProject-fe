import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

interface Task {
    id: number;
    judul: string;
    deskripsi: string;
    due_date: string;
    status: boolean;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        nama: string;
        warna: string;
    } | null;
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

const statusVariants = {
    completed: {
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.5,
        },
    },
};

const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await taskApi.getTaskById(Number(id));
                setTask(response.data);
            } catch (err) {
                setError('Failed to fetch task');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskApi.deleteTask(Number(id));
                navigate('/tasks');
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
    if (!task) return <div className="text-center py-8">Task not found</div>;

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
                    <div className="flex items-center justify-between mb-4">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-gray-800"
                        >
                            {task.judul}
                        </motion.h1>
                        <motion.div
                            variants={statusVariants}
                            animate={task.status ? 'completed' : ''}
                            className="flex items-center space-x-2"
                        >
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${task.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {task.status ? 'Completed' : 'Pending'}
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose max-w-none mb-6"
                    >
                        <p className="text-gray-600">{task.deskripsi}</p>
                    </motion.div>

                    {task.category && (
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="inline-block mb-4"
                        >
                            <span
                                className="px-2 py-1 text-xs rounded-full"
                                style={{ backgroundColor: task.category.warna }}
                            >
                                {task.category.nama}
                            </span>
                        </motion.div>
                    )}

                    <motion.div
                        variants={itemVariants}
                        className="text-sm text-gray-500 mb-6"
                    >
                        <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                        <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(task.updated_at).toLocaleDateString()}</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center space-x-4"
                    >
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate(`/tasks/${id}/edit`)}
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
                            onClick={() => navigate('/tasks')}
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

export default TaskDetail; 