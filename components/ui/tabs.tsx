"use client";

import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

// Main Tabs Component
export function Tabs({ defaultValue = '0', children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="space-y-4">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === TabList) {
            return React.cloneElement(child as React.ReactElement, {
              activeTab,
              onTabChange: setActiveTab,
            });
          } else if (child.type === TabContent) {
            return React.cloneElement(child as React.ReactElement, {
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
export function TabList({ children, activeTab, onTabChange }: any) {
  return (
    <div className="flex border-b border-zinc-200">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === Tab) {
          return React.cloneElement(child as React.ReactElement, {
            isActive: child.props.value === activeTab,
            onTabChange,
          });
        }
        return child;
      })}
    </div>
  );
}

// Tab Component
export function Tab({ value, children, isActive, onTabChange }: any) {
  return (
    <button
      type="button"
      value={value}
      className={`px-4 py-2 text-sm font-medium transition-colors ${isActive 
        ? 'border-b-2 border-[#FCEE21] text-black' 
        : 'border-b-2 border-transparent text-zinc-500 hover:text-black'}`}
      onClick={() => onTabChange(value)}
    >
      {children}
    </button>
  );
}

// Tab Content Component
export function TabContent({ value, children, activeTab }: any) {
  if (value !== activeTab) {
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
}