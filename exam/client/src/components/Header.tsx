import React from 'react';
import { Menu } from 'lucide-react';
import logoUrl from '@assets/image_1756651049186.png';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-border sticky top-0 z-40" data-testid="header">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" data-testid="header-logo">
            <div className="p-2">
              <img src={logoUrl} alt="Government of India Emblem" className="h-10 w-10 object-contain" data-testid="logo-emblem" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground" data-testid="text-header-title">JUT Official Hub</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-header-subtitle">Jharkhand University of Technology</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4" data-testid="nav-desktop">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-materials">Materials</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-support">Support</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">Contact</a>
            </nav>
          </div>
          <button className="md:hidden p-2" data-testid="button-mobile-menu">
            <Menu className="text-foreground" data-testid="icon-menu" />
          </button>
        </div>
      </div>
    </header>
  );
}
