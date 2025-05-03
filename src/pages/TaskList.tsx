import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskApi } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
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
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
        },
    },
    hover: {
        scale: 1.02,
        transition: {
            type: 'spring',
            stiffness: 400,
        },
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: {
            duration: 0.3,
        },
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
        transition: {
            type: 'spring',
            stiffness: 400,
        },
    },
};

const TaskList = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await taskApi.getAllTasks();
                setTasks(response.data);
            } catch (err) {
                setError('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleStatusChange = async (id: number, completed: boolean) => {
        try {
            await taskApi.updateTask(id, { status: completed });
            setTasks(tasks.map(task =>
                task.id === id ? { ...task, status: completed } : task
            ));
        } catch (err) {
            setError('Failed to update task status');
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/tasks/new')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Add Task
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
                        {tasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                custom={index}
                                whileHover="hover"
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{task.judul}</h2>
                                    <motion.div
                                        variants={statusVariants}
                                        animate={task.status ? 'completed' : ''}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                                            className="w-5 h-5 rounded text-blue-500 focus:ring-blue-400"
                                        />
                                        <span className="text-sm text-gray-500">
                                            {task.status ? 'Completed' : 'Pending'}
                                        </span>
                                    </motion.div>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-2">{task.deskripsi}</p>

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

                                <div className="text-sm text-gray-500 mb-4">
                                    <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                                    <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
                                    <p>Updated: {new Date(task.updated_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex space-x-2">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Link
                                            to={`/tasks/${task.id}`}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            View
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Link
                                            to={`/tasks/${task.id}/edit`}
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

export default TaskList; 