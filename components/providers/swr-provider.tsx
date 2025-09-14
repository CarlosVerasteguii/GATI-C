"use client";

import type React from "react";
import { SWRConfig } from "swr";

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 3000, // 3s
        revalidateOnFocus: true,
        // fetcher: (url: string) => fetch(url).then((r) => r.json()),
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;

