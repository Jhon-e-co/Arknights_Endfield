"use client";

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  id: string;
  type: 'blueprint' | 'squad';
  onDeleted?: () => void;
}

export function DeleteButton({ id, type, onDeleted }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);

      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete ${type}: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
