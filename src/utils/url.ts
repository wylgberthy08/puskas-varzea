/**
 * Returns the base URL for the application.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable
 * 2. Vercel URL (if on Vercel)
 * 3. window.location.origin (if on client)
 * 4. Fallback to localhost:3000
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this for your production domain
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000/')

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  
  // Make sure to include a trailing slash.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}
