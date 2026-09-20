import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

function getRole(payload) {
  if (!payload) {
    return null;
  }
  if (payload.usuarioId != null) {
    return 'user';
  }
  if (payload.adminID != null) {
    return 'admin';
  }
  return null;
}

function readStoredPayload() {
  const raw = localStorage.getItem('payload');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const [payload, setPayloadState] = useState(() => readStoredPayload());
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const setToken = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  }, []);

  const login = useCallback((newToken, newPayload) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('payload', JSON.stringify(newPayload));
    setTokenState(newToken);
    setPayloadState(newPayload);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setTokenState(null);
    setPayloadState(null);
  }, []);

  const request = useCallback((path, options = {}) => {
    return api(path, options, { token: tokenRef.current, setToken });
  }, [setToken]);

  const role = getRole(payload);

  const value = useMemo(
    () => ({ token, payload, role, login, logout, setToken, request }),
    [token, payload, role, login, logout, setToken, request]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
