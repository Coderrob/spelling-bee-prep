declare module 'espeak-ng' {
  export interface EspeakModule {
    ready: Promise<EspeakModule>;
    FS: {
      readFile(path: string, options: { encoding: string }): string;
      writeFile(path: string, data: string): void;
      unlink(path: string): void;
    };
    callMain(args: string[]): number;
  }

  interface EspeakModuleFactory {
    (options: { arguments: string[] }): Promise<EspeakModule>;
  }

  const ESpeakNG: EspeakModuleFactory;
  export default ESpeakNG;
}
