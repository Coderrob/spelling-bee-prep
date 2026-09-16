/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ReactNode, ReactElement } from 'react';
import { TopBar } from './TopBar';

/**
 * Props for the AppShell component.
 */
interface AppShellProps {
  children: ReactNode;
  onSettingsClick: () => void;
}

/**
 * Component that provides the overall layout structure of the application.
 *
 * @param children - The main content to be displayed within the app shell.
 * @param onSettingsClick - Callback function to handle settings button click.
 * @returns A React element representing the app shell.
 * @example
 * <AppShell onSettingsClick={handleSettingsClick}>
 *   <MainContent />
 * </AppShell>
 */
export function AppShell({ children, onSettingsClick }: Readonly<AppShellProps>): ReactElement {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to practice
      </a>
      <div className="app-shell__backdrop" aria-hidden="true" />
      <TopBar onSettingsClick={onSettingsClick} />
      <main id="main-content" className="app-shell__main">
        {children}
      </main>
      <footer className="app-shell__footer">
        Built for focused, confidence-building practice from Kindergarten through Grade 12.
      </footer>
    </div>
  );
}
