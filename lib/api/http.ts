// Placeholder for future HTTP wrapper around fetch.
// This module will centralize baseURL, headers, retries and error mapping.

export type ApiRequestOptions = {
  // Optional cache control for RSC/SSR calls
  next?: RequestInit["next"]
  cache?: RequestInit["cache"]
  revalidate?: number
}

// Minimal stub to keep imports stable while we build out the layer
export const http = {
  // Future: get, post, put, delete helpers
}

export default http

