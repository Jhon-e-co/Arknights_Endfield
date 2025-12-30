"use client";

import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onTabChange?: (value: string) => void;
  className?: string;
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}

// Main Tabs Component
export function Tabs({ defaultValue = '0', children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="space-y-4">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabList) {
            return React.cloneElement(child as React.ReactElement<TabListProps>, {
              activeTab,
              onTabChange: setActiveTab,
            });
          } else if (child.type === TabContent) {
            return React.cloneElement(child as React.ReactElement<TabContentProps>, {
              activeTab,
            });
          }
        }
        return child;
      })}
    </div>
  );
}

// Tab List Component
export function TabList({ children, activeTab, onTabChange }: TabListProps) {
  return (
    <div className="flex border-b border-zinc-200">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === Tab) {
          const tabChild = child as React.ReactElement<TabProps>;
          return React.cloneElement(tabChild, {
            isActive: tabChild.props.value === activeTab,
            onTabChange,
          });
        }
        return child;
      })}
    </div>
  );
}

// Tab Component
export function Tab({ value, children, isActive, onTabChange, className }: TabProps) {
  return (
    <button
      type="button"
      value={value}
      className={`px-4 py-2 text-sm font-medium transition-colors ${isActive 
        ? 'border-b-2 border-[#FCEE21] text-black' 
        : 'border-b-2 border-transparent text-zinc-500 hover:text-black'} ${className || ''}`}
      onClick={() => onTabChange?.(value)}
    >
      {children}
    </button>
  );
}

// Tab Content Component
export function TabContent({ value, children, activeTab }: TabContentProps) {
  if (value !== activeTab) {
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
}