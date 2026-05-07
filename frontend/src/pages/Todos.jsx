import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [searchQuery, setSearchQuery] = useState('');

  // When navigated to /?new=true or ?collection=abc
  useEffect(() => {
    if (searchParams.get('new')) {
      openModal();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const collectionId = searchParams.get('collection');

  const loadData = async () => {
    try {
      const [todosData, statsData, colsData] = await Promise.all([
        api('GET', `/todos?sortBy=${sort}${filter !== 'all' ? `&status=${filter}` : ''}${priority ? `&priority=${priority}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`),
        api('GET', '/todos/meta/stats'),
        api('GET', '/collections')
      ]);
      setTodos(todosData || []);
      setStats(statsData || { total: 0, completed: 0, pending: 0, overdue: 0 });
      setCollections(colsData || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filter, priority, sort, searchQuery]);

  const toggleTodo = async (id) => {
    try {
      await api('PATCH', `/todos/${id}/toggle`);
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await api('DELETE', `/todos/${id}`);
      showToast('Deleted ✓');
      loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const openModal = (todo = null) => {
    setEditingTodo(todo);
    formik.resetForm({
      values: todo ? {
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        tags: todo.tags ? todo.tags.join(', ') : '',
        collectionId: todo.collectionId || ''
      } : {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
        collectionId: ''
      }
    });
    setIsModalOpen(true);
  };

  const formik = useFormik({
    initialValues: { title: '', description: '', priority: 'medium', dueDate: '', tags: '', collectionId: '' },
    validationSchema: Yup.object({
      title: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          dueDate: values.dueDate || null,
          tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
          collectionId: values.collectionId || null
        };
        if (editingTodo) {
          await api('PUT', `/todos/${editingTodo._id}`, payload);
          showToast('Updated ✓');
        } else {
          await api('POST', '/todos', payload);
          showToast('Created ✓');
        }
        setIsModalOpen(false);
        loadData();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  });

  const displayedTodos = collectionId ? todos.filter(t => t.collectionId === collectionId) : todos;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-accent before:to-accent2">
          <div className="font-syne text-3xl font-extrabold mb-1">{stats.total}</div>
          <div className="text-muted text-xs">Total Tasks</div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl opacity-15">📋</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-success">
          <div className="font-syne text-3xl font-extrabold mb-1">{stats.completed}</div>
          <div className="text-muted text-xs">Completed</div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl opacity-15">✅</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-warn">
          <div className="font-syne text-3xl font-extrabold mb-1">{stats.pending}</div>
          <div className="text-muted text-xs">Pending</div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl opacity-15">⏳</span>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-danger">
          <div className="font-syne text-3xl font-extrabold mb-1">{stats.overdue}</div>
          <div className="text-muted text-xs">Overdue</div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl opacity-15">🚨</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-1.5 w-full md:w-auto">
          <span className="text-muted">🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-text text-sm w-full md:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${filter === 'all' ? 'bg-accent border-accent text-white' : 'border-border text-muted hover:bg-surface hover:text-text'}`} onClick={() => setFilter('all')}>All</button>
        <button className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${filter === 'pending' ? 'bg-accent border-accent text-white' : 'border-border text-muted hover:bg-surface hover:text-text'}`} onClick={() => setFilter('pending')}>Pending</button>
        <button className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${filter === 'completed' ? 'bg-accent border-accent text-white' : 'border-border text-muted hover:bg-surface hover:text-text'}`} onClick={() => setFilter('completed')}>Completed</button>
        
        <select className="px-3 py-1.5 bg-surface border border-border rounded-xl text-sm outline-none cursor-pointer text-text" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Any Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        
        <select className="px-3 py-1.5 bg-surface border border-border rounded-xl text-sm outline-none cursor-pointer text-text" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt">Latest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {displayedTodos.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <div className="text-5xl mb-4">📝</div>
            <p>No todos found.</p>
          </div>
        ) : displayedTodos.map(t => {
          const col = collections.find(c => c._id === t.collectionId);
          const isCompleted = t.status === 'completed';
          const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && !isCompleted;

          return (
            <div key={t._id} className={`group bg-surface border border-border rounded-xl p-4 flex items-start gap-4 transition-all hover:border-[#ffffff20] hover:shadow-[0_4px_24px_#00000066] relative ${isCompleted ? 'opacity-50' : ''}`}>
              <div 
                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors mt-0.5 ${isCompleted ? 'bg-success border-success text-white' : 'border-border hover:border-success text-transparent'}`}
                onClick={() => toggleTodo(t._id)}
              >
                ✓
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[0.95rem] font-medium mb-1 ${isCompleted ? 'line-through text-muted' : ''}`}>{t.title}</div>
                {t.description && <div className="text-xs text-muted mb-2 truncate">{t.description}</div>}
                
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[0.7rem] font-semibold ${t.priority === 'high' ? 'bg-[#f8717122] text-high' : t.priority === 'medium' ? 'bg-[#fbbf2422] text-medium' : 'bg-[#34d39922] text-low'}`}>
                    {t.priority}
                  </span>
                  
                  {t.dueDate && (
                    <span className={`text-[0.75rem] flex items-center gap-1 ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                      📅 {new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {isOverdue && ' · overdue'}
                    </span>
                  )}
                  
                  {col && (
                    <span className="bg-surface2 rounded-md px-2 py-0.5 text-[0.7rem]" style={{ color: col.color }}>
                      {col.icon} {col.name}
                    </span>
                  )}
                  
                  {(t.tags || []).map(tag => (
                    <span key={tag} className="bg-surface2 rounded-md px-2 py-0.5 text-[0.7rem] text-muted">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 absolute top-4 right-4">
                <button className="tiny-btn" onClick={() => openModal(t)}>✏️</button>
                <button className="tiny-btn del" onClick={() => deleteTodo(t._id)}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000088] backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-[20px] p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="font-syne text-xl font-bold mb-6 flex items-center justify-between">
              <span>{editingTodo ? 'Edit Todo' : 'New Todo'}</span>
              <button className="px-2 py-1 bg-surface2 border border-border rounded-lg text-muted hover:text-text" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-4">
                <label>Title *</label>
                <input type="text" {...formik.getFieldProps('title')} placeholder="What needs to be done?" />
                {formik.touched.title && formik.errors.title && <div className="text-danger text-xs mt-1">{formik.errors.title}</div>}
              </div>
              
              <div className="form-group mb-4">
                <label>Description</label>
                <textarea {...formik.getFieldProps('description')} placeholder="Add details..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label>Priority</label>
                  <select {...formik.getFieldProps('priority')}>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" {...formik.getFieldProps('dueDate')} />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Collection</label>
                <select {...formik.getFieldProps('collectionId')}>
                  <option value="">No Collection</option>
                  {collections.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-6">
                <label>Tags (comma separated)</label>
                <input type="text" {...formik.getFieldProps('tags')} placeholder="work, urgent, ideas" />
              </div>

              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={formik.isSubmitting} className="btn flex-1">{formik.isSubmitting ? 'Saving...' : 'Save Todo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}