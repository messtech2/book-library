import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../types/user';

type LoginData = {
  email: string;
  password: string;
};

const loginUser = async (data: LoginData): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    throw new Error('Invalid email or password');
  }

  if (!response.ok) {
    throw new Error('Failed to log in');
  }

  return response.json() as Promise<User>;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
