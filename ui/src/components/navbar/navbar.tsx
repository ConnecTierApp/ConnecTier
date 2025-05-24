"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

import { Button } from '../ui/button';

interface NavbarProps {
  organizationName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ organizationName }) => {
  return (
    <header className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-20">
      <div className="flex h-full items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="ConnecTier Logo" 
              width={32} 
              height={32} 
              className="object-contain rounded-lg"
            />
            <span className="font-semibold text-xl">ConnecTier</span>
          </Link>
          {organizationName && (
            <span className="text-muted-foreground">
              | {organizationName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/logout" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
