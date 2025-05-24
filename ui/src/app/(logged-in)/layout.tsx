"use client";

import React from 'react';
import { Navbar } from '@/components/navbar/navbar';
import { Sidebar } from '@/components/sidebar/sidebar';

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

export default function LoggedInLayout({ children }: LoggedInLayoutProps) {
  // This would typically come from an auth context or API
  const organizationName = 'ConnecTier Organization';
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar organizationName={organizationName} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-64 pt-16 min-h-screen">
          <div className="container py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
