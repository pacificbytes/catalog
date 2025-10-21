import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    bodySizeLimit: '2mb', // or any value you need, e.g. '5mb', '20mb'
  },
};

export default nextConfig;
