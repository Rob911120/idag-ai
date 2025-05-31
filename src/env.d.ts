type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    geoSubdomain?: string;
    language?: string;
  }
}
