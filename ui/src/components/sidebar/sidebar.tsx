"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LucideIcon, Users, Building, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  href, 
  icon: Icon, 
  title, 
  isActive = false 
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const entityType = searchParams.get('type') || 'all';
  
  return (
    <aside className="fixed left-0 top-16 z-10 h-[calc(100vh-4rem)] w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">Main</h3>
            <nav className="space-y-1">
              <SidebarItem 
                href="/entities?type=startup" 
                icon={Building} 
                title="Startups" 
                isActive={pathname.includes('/entities') && entityType === 'startup'}
              />
              <SidebarItem 
                href="/entities?type=mentor" 
                icon={Users} 
                title="Mentors" 
                isActive={pathname.includes('/entities') && entityType === 'mentor'}
              />
              <SidebarItem 
                href="/contexts" 
                icon={Layers} 
                title="Cohorts" 
                isActive={pathname.includes('/contexts')}
              />
            </nav>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="rounded-lg bg-accent/50 p-4">
            <p className="text-xs text-muted-foreground">
              Need help? Check out our documentation or contact support.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
