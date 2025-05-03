import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { noteApi, taskApi, categoryApi } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';

interface Stats {
  notes: number;
  tasks: number;
  categories: number;
  completedTasks: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
};

const actionVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const Home = () => {
  const [stats, setStats] = useState<Stats>({
    notes: 0,
    tasks: 0,
    categories: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [notesResponse, tasksResponse, categoriesResponse] = await Promise.all([
          noteApi.getAllNotes(),
          taskApi.getAllTasks(),
          categoryApi.getAllCategories(),
        ]);

        const completedTasks = tasksResponse.data.filter((task: any) => task.status).length;

        setStats({
          notes: notesResponse.data.length,
          tasks: tasksResponse.data.length,
          categories: categoriesResponse.data.length,
          completedTasks,
        });
      } catch (err) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Dashboard
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Stats cards */}
          <motion.div variants={cardVariants}>
            <Link
              to="/notes"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{stats.notes}</h2>
                  <p className="text-gray-600">Notes</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-100 p-3 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link
              to="/tasks"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{stats.tasks}</h2>
                  <p className="text-gray-600">Tasks</p>
                  <p className="text-sm text-green-600">{stats.completedTasks} completed</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-green-100 p-3 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link
              to="/categories"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{stats.categories}</h2>
                  <p className="text-gray-600">Categories</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-purple-100 p-3 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </motion.div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stats.tasks > 0
                      ? Math.round((stats.completedTasks / stats.tasks) * 100)
                      : 0}
                    %
                  </h2>
                  <p className="text-gray-600">Completion Rate</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-yellow-100 p-3 rounded-full"
                >
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <motion.div variants={actionVariants}>
              <Link
                to="/notes/new"
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-100 p-2 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.div>
                <span className="text-gray-700">Add New Note</span>
              </Link>
            </motion.div>

            <motion.div variants={actionVariants}>
              <Link
                to="/tasks/new"
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-green-100 p-2 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.div>
                <span className="text-gray-700">Add New Task</span>
              </Link>
            </motion.div>

            <motion.div variants={actionVariants}>
              <Link
                to="/categories/new"
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-purple-100 p-2 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.div>
                <span className="text-gray-700">Add New Category</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;