import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
  const { showToast } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadData = async () => {
    try {
      const data = await api('GET', '/feedback');
      setFeedbacks(data || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const openModal = () => {
    formik.resetForm();
    setIsModalOpen(true);
  };
  return (
    <div>
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-syne text-3xl font-bold bg-gradient-to-br from-accent to-accent2 bg-clip-text text-transparent">User Feedback</h2>
          <p className="text-muted text-sm mt-1">See what others are saying and share your thoughts.</p>
        </div>
        <button onClick={openModal} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-accent to-[#5b4fd4] rounded-xl text-white font-sans text-sm cursor-pointer hover:opacity-90 whitespace-nowrap">
          ＋ Add Feedback
        </button>
      </div>
      <div className="bg-surface border border-border rounded-xl p-5 mb-8 flex items-center justify-between">
        <div>
          <div className="font-syne text-3xl font-extrabold">{feedbacks.length}</div>
          <div className="text-muted text-xs">Total Reviews</div>
        </div>
        <div className="text-right">
          <div className="font-syne text-3xl font-extrabold text-accent">
            {feedbacks.length > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-muted text-xs">Average Rating</div>
        </div>
      </div>
    </div>
  )
}

export default Feedback
