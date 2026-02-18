'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginCheckProps {
  children: React.ReactNode;
}

export function LoginCheck({ children }: LoginCheckProps) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') : null;

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}