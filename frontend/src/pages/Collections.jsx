Mohamed elghadery
mohamed038657
Sharing their screen

Smash Karts
APP
 — 5/2/2026 11:23 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
Smash Karts
APP
 — 5/2/2026 11:30 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
Muhammed _abdrabou — 5/2/2026 11:32 PM
MuhammadAbdrabou
Smash Karts
APP
 — 5/3/2026 5:08 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
Muhammed _abdrabou
 started a call that lasted an hour. — 5/3/2026 5:10 PM
Mohamed elghadery
 added 
РЕМоц
 to the group. — 5/3/2026 5:22 PM
Smash Karts
APP
 — 5/3/2026 5:55 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
Smash Karts
APP
 — 5/3/2026 6:15 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
Muhammed _abdrabou
 started a call. — 10:43 PM
صلعت زكريا — 10:59 PM
npm i
Smash Karts
APP
 — 11:10 PM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
صلعت زكريا — 11:15 PM
$ git checkout -b bkinfront
layouts
Layout.jsx
export default function Layout() {

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 

message.txt
5 KB
صلعت زكريا — 11:25 PM
const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCollections();
  }, [location]); // Reload collections occasionally or just once

  const loadCollections = async () => {
    try {
      const data = await api('GET', '/collections');
      setCollections(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const navItemClass = ({ isActive }) => 
    nav-item ${isActive ? 'active' : ''};
components
Toast.jsx
export default function Toast({ message, type }) {
  const isError = type === 'error';
  return (
    <div className={fixed bottom-8 right-8 bg-surface border rounded-xl py-3 px-5 text-sm z-50 shadow-lg ${isError ? 'border-danger text-danger' : 'border-success text-success'}}>
      {message}
    </div>
  );
}
صلعت زكريا — 11:49 PM
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
صلعت زكريا — 12:00 AM
git pull origin main
Mohamed elghadery — 12:02 AM
fatal: not a git repository (or any of the parent directories): .git
Smash Karts
APP
 — 12:10 AM
Game Invitation
Smash Karts
Game ended. Start a new one?

Play
صلعت زكريا — 12:24 AM
Register.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

message.txt
4 KB
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
Mohamed elghadery — 12:31 AM
.
صلعت زكريا — 12:31 AM
git checkout -b bkinfront
Login.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

message.txt
3 KB
Profile.jsx
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

message.txt
5 KB
صلعت زكريا — 12:51 AM
Collections.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

message.txt
6 KB
﻿
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const loadCollections = async () => {
    try {
      const data = await api('GET', '/collections');
      setCollections(data || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const deleteCollection = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete collection? Todos will be unlinked.')) return;
    try {
      await api('DELETE', `/collections/${id}`);
      showToast('Deleted ✓');
      loadCollections();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const formik = useFormik({
    initialValues: { name: '', description: '', icon: '📋', color: '#7c6af7' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      icon: Yup.string().max(2, 'Max 2 characters')
    }),
    onSubmit: async (values) => {
      try {
        await api('POST', '/collections', { ...values, icon: values.icon || '📋' });
        showToast('Collection created ✓');
        setIsModalOpen(false);
        loadCollections();
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  });

  const openModal = () => {
    formik.resetForm();
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {collections.map(c => (
          <div 
            key={c._id} 
            className="group bg-surface border border-border rounded-[14px] p-5 cursor-pointer transition-all relative hover:-translate-y-0.5 hover:shadow-[0_8px_32px_#0008]"
            onClick={() => navigate(`/?collection=${c._id}`)}
          >
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="tiny-btn del" onClick={(e) => deleteCollection(c._id, e)}>🗑</button>
            </div>
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="font-syne font-bold mb-1">{c.name}</div>
            <div className="text-xs text-muted">{c.todoCount || 0} tasks</div>
          </div>
        ))}
        
        <div 
          className="bg-transparent border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted text-sm cursor-pointer transition-colors min-h-[130px] rounded-[14px] hover:border-accent hover:text-accent"
          onClick={openModal}
        >
          <span className="text-xl">＋</span>
          <span>New Collection</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000088] backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-[20px] p-8 w-full max-w-[500px]">
            <div className="font-syne text-xl font-bold mb-6 flex items-center justify-between">
              <span>New Collection</span>
              <button className="px-2 py-1 bg-surface2 border border-border rounded-lg text-muted hover:text-text" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-4">
                <label>Name *</label>
                <input type="text" {...formik.getFieldProps('name')} placeholder="Project name" />
                {formik.touched.name && formik.errors.name && <div className="text-danger text-xs mt-1">{formik.errors.name}</div>}
              </div>
              
              <div className="form-group mb-4">
                <label>Description</label>
                <input type="text" {...formik.getFieldProps('description')} placeholder="What is this collection for?" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="form-group">
                  <label>Icon</label>
                  <input type="text" {...formik.getFieldProps('icon')} placeholder="📋" maxLength="2" />
                  {formik.touched.icon && formik.errors.icon && <div className="text-danger text-xs mt-1">{formik.errors.icon}</div>}
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input type="color" {...formik.getFieldProps('color')} className="!p-1 h-[46px] cursor-pointer" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={formik.isSubmitting} className="btn flex-1">{formik.isSubmitting ? 'Creating...' : 'Create Collection'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}