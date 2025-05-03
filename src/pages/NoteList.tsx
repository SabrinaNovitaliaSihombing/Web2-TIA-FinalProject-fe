import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { noteApi } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

interface Note {
    id: number;
    judul: string;
    isi: string;
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

const NoteList = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await noteApi.getAllNotes();
                setNotes(response.data);
            } catch (err) {
                setError('Failed to fetch notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await noteApi.deleteNote(id);
                setNotes(notes.filter((note) => note.id !== id));
            } catch (err) {
                setError('Failed to delete note');
            }
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
                    <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => navigate('/notes/new')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Add Note
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
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                whileHover="hover"
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <motion.h2
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl font-semibold text-gray-800 mb-2"
                                >
                                    {note.judul}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-600 mb-4 line-clamp-3"
                                >
                                    {note.isi}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm text-gray-500 mb-4"
                                >
                                    <p>Created: {new Date(note.created_at).toLocaleDateString()}</p>
                                    <p>Updated: {new Date(note.updated_at).toLocaleDateString()}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex justify-end space-x-2"
                                >
                                    <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        <Link to={`/notes/${note.id}`}>View</Link>
                                    </motion.button>

                                    <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() => handleDelete(note.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Delete
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
};

export default NoteList; 