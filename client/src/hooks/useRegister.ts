import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../types/user';

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const registerUser = async (data: RegisterData): Promise<User> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    
    body: JSON.stringify({ ...data, role: undefined }),
  });

  if (response.status === 409) {
    throw new Error('Email is already registered');
  }
  if (response.status === 400) {
    throw new Error('Validation Failed');
  }

  if (!response.ok) {
    throw new Error('Failed to Register');
  }

  return response.json() as Promise<User>;
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login'] });
    },
  });
};




