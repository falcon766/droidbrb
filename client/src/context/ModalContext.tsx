import React, { createContext, useContext, useState } from 'react';
import { Modal } from '../types';

interface ModalContextType {
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = (modal: Omit<Modal, 'id' | 'isOpen'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal: Modal = {
      ...modal,
      id,
      isOpen: true,
    };

    setModals(prev => [...prev, newModal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, isOpen: false } : modal
    ));
    
    // Remove modal from state after animation
    setTimeout(() => {
      setModals(prev => prev.filter(modal => modal.id !== id));
    }, 200);
  };

  const closeAllModals = () => {
    setModals(prev => prev.map(modal => ({ ...modal, isOpen: false })));
    setTimeout(() => {
      setModals([]);
    }, 200);
  };

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}; 