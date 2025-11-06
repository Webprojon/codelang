import { useState, useCallback } from 'react';

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const showConfirm = useCallback((modalTitle: string, onConfirm: () => void | Promise<void>) => {
    setTitle(modalTitle);
    setOnConfirmCallback(() => onConfirm);
    setIsLoading(false);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!onConfirmCallback) return;

    try {
      await onConfirmCallback();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to confirm:', error);
      setIsOpen(false);
    }
  }, [onConfirmCallback]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    title,
    showConfirm,
    handleConfirm,
    handleCancel,
    isLoading,
    setLoading: setIsLoading,
  };
};
