import type { ReactNode, ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

/** Props for the I18nProvider component. */
interface I18nProviderProps {
  children: ReactNode;
}

/**
 * Component that provides internationalization support using i18next.
 *
 * @param children - The child components that require i18n support.
 * @returns A React element that wraps children with I18nextProvider.
 * @example
 * <I18nProvider>
 *   <YourComponent />
 * </I18nProvider>
 */
export function I18nProvider({ children }: Readonly<I18nProviderProps>): ReactElement {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
