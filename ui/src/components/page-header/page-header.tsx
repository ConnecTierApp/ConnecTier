import React from "react";

export interface PageHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actionArea?: React.ReactNode;
}

export function PageHeader({ icon, title, subtitle, actionArea }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="p-1.5 rounded-md bg-primary/10">{icon}</div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actionArea && <div>{actionArea}</div>}
    </div>
  );
}
