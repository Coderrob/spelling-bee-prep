import { createServer } from 'vite';

/** Starts Vite in-process so Playwright can always close it cleanly on Windows. */
export default async function globalSetup(): Promise<() => Promise<void>> {
  const server = await createServer({
    server: { host: '127.0.0.1', port: 5173, strictPort: true },
  });
  await server.listen();
  return async () => server.close();
}
