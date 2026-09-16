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

import type { ReactElement } from 'react';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { APP_NAME, APP_EMOJI } from '@/types/constants';

/**
 * Props for the TopBar component.
 */
interface TopBarProps {
  onSettingsClick: () => void;
}

/**
 * Component rendering the top bar of the application.
 *
 * @param onSettingsClick - Callback function to handle settings button click.
 * @returns A React element representing the top bar.
 * @example
 * <TopBar onSettingsClick={handleSettingsClick} />
 */
export function TopBar({ onSettingsClick }: Readonly<TopBarProps>): ReactElement {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-brand">
          <span className="app-brand__mark" aria-hidden="true">
            {APP_EMOJI}
          </span>
          <div className="app-brand__copy">
            <p className="app-brand__name">{APP_NAME}</p>
            <p className="app-brand__tagline">Listen. Spell. Grow.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Open settings"
          className="app-header__settings"
        >
          <SettingsIcon fontSize="small" aria-hidden="true" />
          <span className="app-header__settings-label">Settings</span>
        </button>
      </div>
    </header>
  );
}
