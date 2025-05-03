import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noteApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

interface Note {
    id: number;
    judul: string;
    deskripsi: string;
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

const NoteDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await noteApi.getNoteById(Number(id));
                setNote(response.data);
            } catch (err) {
                setError('Failed to fetch note');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await noteApi.deleteNote(Number(id));
                navigate('/notes');
            } catch (err) {
                setError('Failed to delete note');
            }
        }
    };

    if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
    if (!note) return <div className="text-center py-8">Note not found</div>;

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
                            {note.judul}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose max-w-none mb-6"
                    >
                        <p className="text-gray-600 whitespace-pre-wrap">{note.deskripsi}</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="text-sm text-gray-500 mb-6"
                    >
                        <p>Created: {new Date(note.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(note.updated_at).toLocaleDateString()}</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center space-x-4"
                    >
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => navigate(`/notes/${id}/edit`)}
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
                            onClick={() => navigate('/notes')}
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

export default NoteDetail; 