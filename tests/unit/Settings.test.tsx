import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Settings } from '@/components/Settings';
import '@testing-library/jest-dom';

describe('Settings Component', () => {
  it('should render when open', () => {
    const onClose = vi.fn();
    render(<Settings open={true} onClose={onClose} />);
    
    // Check for settings title or close button
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const onClose = vi.fn();
    render(<Settings open={false} onClose={onClose} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display sliders', () => {
    const onClose = vi.fn();
    render(<Settings open={true} onClose={onClose} />);
    
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2); // Speech rate and volume
  });

  it('should display close button', () => {
    const onClose = vi.fn();
    render(<Settings open={true} onClose={onClose} />);
    
    expect(screen.getByText(/close/i)).toBeInTheDocument();
  });
});
