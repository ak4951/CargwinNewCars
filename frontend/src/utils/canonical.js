export const SITE_URL = 'https://hunter.lease';

// Several routes render the same page. Point every copy at one URL so they don't
// compete as duplicates. Keep in sync with the routes in App.js.
const ALIASES = [
  [/^\/offers$/, () => '/deals'],
  [/^\/(?:cars|offer)\/([^/]+)$/, (match) => `/car/${match[1]}`],
];

export function canonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  for (const [pattern, toPath] of ALIASES) {
    const match = path.match(pattern);
    if (match) return toPath(match);
  }
  return path;
}

export function canonicalUrl(pathname) {
  return `${SITE_URL}${canonicalPath(pathname)}`;
}
