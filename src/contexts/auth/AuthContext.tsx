
import React, { createContext } from 'react';
import { AuthContextType } from '../../types/auth';

// Create a context with undefined default value and proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
