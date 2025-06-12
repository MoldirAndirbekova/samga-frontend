"use client"

import { useState, useEffect, FormEvent } from "react";
import { BiPencil, BiSave, BiTrash, BiX, BiPlus } from "react-icons/bi";
import api from "@/lib/api";
import Image from "next/image";
import { useChild } from "@/contexts/ChildContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  full_name: string;
  email: string;
  children?: Child[]; 
}

interface Child {
  id: string;
  full_name: string;
  user_id: string;
}

export default function Profile() {
  const t = useTranslations("ProfileAcc");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editChildMode, setEditChildMode] = useState<string | null>(null);
  const [addChildMode, setAddChildMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });
  const [childFormData, setChildFormData] = useState({
    full_name: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setSelectedChildId, refreshChildren } = useChild();
  const router = useRouter();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/me");

      if (response.data) {
        setUser(response.data);
        setFormData({
          full_name: response.data.full_name,
          email: response.data.email,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(t('errors.load-profile'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle user data form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle child form input changes
  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChildFormData({
      ...childFormData,
      [name]: value,
    });
  };

  // Save user data
  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put("/users/me", formData);
      
      if (response.data) {
        setUser(response.data);
        setEditMode(false);
        setSuccessMessage(t('success.profile-updated'));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error updating user data:", error);
      setError(error.response?.data?.detail || t('errors.update-profile'));
    } finally {
      setLoading(false);
    }
  };

  // Create new child
  const handleAddChild = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post("/children", childFormData);
      
      if (response.data) {
        // Refresh user data to get updated children list
        await fetchUserData();
        // Refresh the children list in the context
        await refreshChildren();
        setAddChildMode(false);
        setChildFormData({ full_name: '' });
        setSuccessMessage(t('success.child-added'));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error adding child:", error);
      setError(error.response?.data?.detail || t('errors.add-child'));
    } finally {
      setLoading(false);
    }
  };

  // Update child
  const handleUpdateChild = async (e: FormEvent, childId: string) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/children/${childId}`, {
        full_name: childFormData.full_name
      });
      
      if (response.data) {
        // Refresh user data to get updated children list
        await fetchUserData();
        // Refresh the children list in the context
        await refreshChildren();
        setEditChildMode(null);
        setChildFormData({ full_name: '' });
        setSuccessMessage(t('success.child-updated'));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error updating child:", error);
      setError(error.response?.data?.detail || t('errors.update-child'));
    } finally {
      setLoading(false);
    }
  };

  // Delete child
  const handleDeleteChild = async (childId: string) => {
    if (!confirm(t('confirm.delete-child'))) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/children/${childId}`);
      
      // Refresh user data to get updated children list
      await fetchUserData();
      // Refresh the children list in the context
      await refreshChildren();
      setSuccessMessage(t('success.child-deleted'));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error deleting child:", error);
      setError(error.response?.data?.detail || t('errors.delete-child'));
    } finally {
      setLoading(false);
    }
  };

  // Select child
  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    router.push("/games");
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F9DB63]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 text-[#694800]">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage(null)}>
            <BiX className="text-xl" />
          </span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <BiX className="text-xl" />
          </span>
        </div>
      )}
      
      {/* User profile section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="flex flex-col items-center w-full md:w-1/3">
          <h2 className="text-3xl font-bold mb-6">{t('account')}</h2>
          <Image
            src="/icons/user-avatar.png"
            alt={t('user-avatar-alt')}
            width={160}
            height={160}
            className="bg-[#F9DB63] rounded-xl w-40 h-40"
          />
          <p className="mt-3 text-xl font-bold">{t('personal-account')}</p>
        </div>
        
        <div className="flex-1 p-4 md:p-10 relative w-full">
          {!editMode ? (
            <>
              <button 
                className="absolute top-3 right-2 text-2xl text-gray-800 hover:text-gray-600"
                onClick={() => setEditMode(true)}
                aria-label={t('buttons.edit-profile')}
              >
                <BiPencil />
              </button>
              <div className="space-y-4 w-full">
                <div className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">
                  {t('name')}: {user?.full_name}
                </div>
                <div className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold">
                  {t('email')}: {user?.email}
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveUser} className="space-y-4 w-full">
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    // Reset form data
                    if (user) {
                      setFormData({
                        full_name: user.full_name,
                        email: user.email,
                      });
                    }
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full flex items-center"
                  aria-label={t('buttons.cancel-editing')}
                >
                  <BiX className="mr-1" /> {t('buttons.cancel')}
                </button>
                <button 
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center"
                  disabled={loading}
                  aria-label={t('buttons.save-profile-changes')}
                >
                  <BiSave className="mr-1" /> {t('buttons.save')}
                </button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold w-full"
                    placeholder={t('placeholders.full-name')}
                    required
                  />
                  <label className="absolute left-3 top-1 text-xs text-gray-700">{t('labels.name')}</label>
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-[#F9DB63] px-7 py-2 rounded-3xl text-lg font-semibold w-full"
                    placeholder={t('placeholders.email')}
                    required
                  />
                  <label className="absolute left-3 top-1 text-xs text-gray-700">{t('labels.email')}</label>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Children section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{t('children')}</h2>
          <button 
            onClick={() => setAddChildMode(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
            aria-label={t('buttons.add-new-child')}
          >
            <BiPlus className="mr-1" /> {t('buttons.add-child')}
          </button>
        </div>
        
        {/* Add child form */}
        {addChildMode && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-bold text-xl mb-3">{t('add-new-child')}</h3>
            <form onSubmit={handleAddChild}>
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  name="full_name"
                  value={childFormData.full_name}
                  onChange={handleChildInputChange}
                  className="bg-[#F9DB63] px-4 py-2 rounded-xl text-md font-semibold flex-1"
                  placeholder={t('placeholders.child-name')}
                  required
                />
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setAddChildMode(false);
                      setChildFormData({ full_name: '' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full flex items-center"
                  >
                    <BiX className="mr-1" /> {t('buttons.cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center"
                    disabled={loading}
                  >
                    <BiSave className="mr-1" /> {t('buttons.save')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Children cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.children && user.children.length > 0 ? (
            user.children.map((child) => (
              <div key={child.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
                {editChildMode === child.id ? (
                  // Edit mode
                  <form onSubmit={(e) => handleUpdateChild(e, child.id)}>
                    <div className="flex items-center mb-3">
                      <input 
                        type="text" 
                        name="full_name"
                        value={childFormData.full_name}
                        onChange={handleChildInputChange}
                        className="bg-[#F9DB63] px-4 py-2 rounded-xl text-md font-semibold flex-1"
                        placeholder={t('placeholders.child-name')}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button 
                        type="button"
                        onClick={() => {
                          setEditChildMode(null);
                          setChildFormData({ full_name: '' });
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-full flex items-center text-sm"
                      >
                        <BiX className="mr-1" /> {t('buttons.cancel')}
                      </button>
                      <button 
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full flex items-center text-sm"
                        disabled={loading}
                      >
                        <BiSave className="mr-1" /> {t('buttons.save')}
                      </button>
                    </div>
                  </form>
                ) : (
                  // View mode
                  <>
                    <div className="flex justify-between">
                      <div className="flex items-center mb-3">
                        <Image
                          src="/icons/kid-avatar.png"
                          alt={t('child-avatar-alt')}
                          width={40}
                          height={40}
                          className="bg-[#F9DB63] rounded-full mr-3"
                        />
                        <h3 className="font-bold text-lg">{child.full_name}</h3>
                      </div>
                      <div className="flex">
                        <button 
                          onClick={() => {
                            setEditChildMode(child.id);
                            setChildFormData({ full_name: child.full_name });
                          }}
                          className="text-gray-600 hover:text-blue-600 p-1"
                          aria-label={t('buttons.edit-child')}
                        >
                          <BiPencil />
                        </button>
                        <button 
                          onClick={() => handleDeleteChild(child.id)}
                          className="text-gray-600 hover:text-red-600 p-1"
                          aria-label={t('buttons.delete-child')}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mt-auto flex justify-center pt-4">
                      <button
                        onClick={() => handleSelectChild(child.id)}
                        className="bg-[#F9DB63] hover:bg-[#e9cc59] text-[#694800] font-bold py-2 px-6 rounded-full"
                      >
                        {t('buttons.select-for-games')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-yellow-50 rounded-lg">
              <p className="text-lg text-yellow-700">{t('no-children.title')}</p>
              <p className="text-gray-600 mt-2">{t('no-children.subtitle')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}