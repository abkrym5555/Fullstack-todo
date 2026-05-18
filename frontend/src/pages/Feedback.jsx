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
      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted">
            <div className="text-5xl mb-4">💬</div>
            <p>No feedback yet. Be the first to share your thoughts!</p>
          </div>
        ) : feedbacks.map(f => (
          <div key={f._id} className="bg-surface border border-border rounded-xl p-5 hover:border-[#ffffff20] hover:shadow-[0_4px24px#00000066] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {f.user?.profilePicture ? (
                  <img src={f.user.profilePicture} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-white">
                    {`f.user?.name?.[0]?.toUpperCase()  'U'`}
                  </div>
                )}
                <div>
                  <div className="font-medium text-sm">{`f.user?.name  'Unknown User'`}</div>
                  <div className="text-xs text-muted">{new Date(f.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < f.rating ? 'text-accent' : 'text-muted opacity-30'}`}>★</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-text opacity-90">{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feedback
