import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { noteApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from './LoadingOverlay';

interface NoteFormProps {
    isEdit?: boolean;
}

interface FormData {
    judul: string;
    deskripsi: string;
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

const NoteForm = ({ isEdit = false }: NoteFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<FormData>({
        judul: '',
        deskripsi: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            const fetchNote = async () => {
                try {
                    const response = await noteApi.getNoteById(Number(id));
                    setFormData({
                        judul: response.data.judul,
                        deskripsi: response.data.deskripsi,
                    });
                } catch (err) {
                    setError('Failed to fetch note');
                }
            };
            fetchNote();
        }
    }, [isEdit, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEdit && id) {
                await noteApi.updateNote(Number(id), formData);
            } else {
                await noteApi.createNote(formData);
            }
            navigate('/notes');
        } catch (err) {
            setError('Failed to save note');
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
                    {isEdit ? 'Edit Note' : 'Create New Note'}
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
                            onClick={() => navigate('/notes')}
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

export default NoteForm; 