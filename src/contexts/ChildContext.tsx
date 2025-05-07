'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from "@/lib/api";

export interface Child {
  id: string;
  full_name: string;
  user_id: string;
}

interface ChildContextType {
  children: Child[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  selectedChild: Child | null;
  loading: boolean;
  error: string | null;
  refreshChildren: () => Promise<void>;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
}

interface ChildProviderProps {
  children: ReactNode;
}

export function ChildProvider({ children }: ChildProviderProps) {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a function to fetch and update the children list
  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/children/');
      setChildrenList(response.data);
      
      // If no child is selected but we have children, select the first one
      if (!selectedChildId && response.data.length > 0) {
        setSelectedChildId(response.data[0].id);
      }
      
      // If the selected child has been deleted, select the first available child
      if (selectedChildId && response.data.length > 0) {
        const childExists = response.data.some((child: Child) => child.id === selectedChildId);
        if (!childExists) {
          setSelectedChildId(response.data[0].id);
        }
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Failed to load children');
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedChildId]);

  // Exposed function to refresh children list
  const refreshChildren = useCallback(async () => {
    return await fetchChildren();
  }, [fetchChildren]);

  // Load the selected child ID from localStorage on initial mount
  useEffect(() => {
    const storedChildId = localStorage.getItem('selectedChildId');
    if (storedChildId) {
      setSelectedChildId(storedChildId);
    }
  }, []);

  // Save selected child ID to localStorage whenever it changes
  useEffect(() => {
    if (selectedChildId) {
      localStorage.setItem('selectedChildId', selectedChildId);
    } else {
      localStorage.removeItem('selectedChildId');
    }
    // Dispatch event for components that are listening for child changes
    window.dispatchEvent(new CustomEvent('childChanged', { detail: selectedChildId }));
  }, [selectedChildId]);

  // Fetch children list on component mount
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Update selected child when selectedChildId or children list changes
  useEffect(() => {
    if (selectedChildId && childrenList.length > 0) {
      const child = childrenList.find(c => c.id === selectedChildId);
      setSelectedChild(child || null);
    } else {
      setSelectedChild(null);
    }
  }, [selectedChildId, childrenList]);

  return (
    <ChildContext.Provider
      value={{
        children: childrenList,
        selectedChildId,
        setSelectedChildId,
        selectedChild,
        loading,
        error,
        refreshChildren
      }}
    >
      {children}
    </ChildContext.Provider>
  );
} 