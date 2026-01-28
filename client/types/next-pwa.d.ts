declare module 'next-pwa' {
  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: any[];
  }
  
  function withPWA(config: PWAConfig): (nextConfig: any) => any;
  export default withPWA;
}