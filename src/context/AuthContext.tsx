import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('crok_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (username: string, password: string) => {
    try {
      console.log('Attempting to register user:', username);
      
      // Hash simple del password (en producción usa bcrypt)
      const hashedPassword = btoa(password);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, password: hashedPassword }])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        throw new Error(error.message);
      }

      console.log('User registered successfully:', data);

      const newUser = { id: data.id, username: data.username };
      setUser(newUser);
      localStorage.setItem('crok_user', JSON.stringify(newUser));
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.message.includes('duplicate')) {
        throw new Error('Username already exists');
      }
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting to login user:', username);
      
      const hashedPassword = btoa(password);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', hashedPassword)
        .single();

      if (error || !data) {
        console.error('Login error:', error);
        throw new Error('Invalid credentials');
      }

      console.log('User logged in successfully:', data);

      const loggedUser = { id: data.id, username: data.username };
      setUser(loggedUser);
      localStorage.setItem('crok_user', JSON.stringify(loggedUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crok_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
