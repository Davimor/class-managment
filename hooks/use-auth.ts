'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    // Solo ejecutar en cliente
    if (typeof window === 'undefined') return;

    // Cargar datos del usuario desde localStorage
    try {
      const storedToken = localStorage?.getItem('token');
      const storedUser = localStorage?.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage?.removeItem('token');
        localStorage?.removeItem('user');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setToken(null);
    router.push('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    try {
      if (typeof window !== 'undefined') {
        localStorage?.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const isAdmin = user?.Role === 'admin';
  const isMaestro = user?.Role === 'maestro';
  const isSecretaria = user?.Role === 'secretaria';

  return {
    user,
    token,
    isLoading: !isMounted || isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin,
    isMaestro,
    isSecretaria,
    logout,
    updateUser,
  };
}
