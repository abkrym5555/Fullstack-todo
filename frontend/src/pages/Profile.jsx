import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, showToast, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues: { 
      name: currentUser?.name || '', 
      email: currentUser?.email || '', 
      profilePicture: currentUser?.profilePicture || '',
      password: '' // Optional for update
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      profilePicture: Yup.string().url('Must be a valid URL'),
      password: Yup.string().min(6, 'Must be at least 6 characters')
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          email: values.email,
          profilePicture: values.profilePicture
        };
        if (values.password) payload.password = values.password;

        await api('PUT', '/users/me', payload);
        showToast('Profile updated ✓');
        
        // Update local user state
        setCurrentUser(prev => ({ ...prev, ...payload }));
        
        // Reset password field
        formik.setFieldValue('password', '');
      } catch (e) {
        showToast(e.message, 'error');
      }
    }
  });

  return (
    <div className="max-w-[600px] mx-auto bg-surface border border-border rounded-[20px] p-8">
      <div className="font-syne text-2xl font-bold mb-8">Edit Profile</div>
      
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
        {formik.values.profilePicture ? (
          <img src={formik.values.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-surface2" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-3xl border-4 border-surface2">
            {formik.values.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1">
          <div className="text-lg font-medium">{formik.values.name || 'User Name'}</div>
          <div className="text-muted text-sm">{formik.values.email || 'user@example.com'}</div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group mb-5">
          <label>Full Name *</label>
          <input type="text" {...formik.getFieldProps('name')} />
          {formik.touched.name && formik.errors.name && <div className="text-danger text-xs mt-1">{formik.errors.name}</div>}
        </div>

        <div className="form-group mb-5">
          <label>Email Address *</label>
          <input type="email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email && <div className="text-danger text-xs mt-1">{formik.errors.email}</div>}
        </div>

        <div className="form-group mb-5">
          <label>Profile Picture URL</label>
          <input type="text" {...formik.getFieldProps('profilePicture')} placeholder="https://..." />
          {formik.touched.profilePicture && formik.errors.profilePicture && <div className="text-danger text-xs mt-1">{formik.errors.profilePicture}</div>}
        </div>

        <div className="form-group mb-8">
          <label>New Password (leave blank to keep current)</label>
          <input type="password" {...formik.getFieldProps('password')} placeholder="••••••••" />
          {formik.touched.password && formik.errors.password && <div className="text-danger text-xs mt-1">{formik.errors.password}</div>}
        </div>

        <button type="submit" disabled={formik.isSubmitting || !formik.dirty} className="btn">
          {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}