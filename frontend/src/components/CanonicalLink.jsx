import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { canonicalUrl } from '../utils/canonical';

// One rel="canonical" for whatever route is on screen. A page can still set its own with
// <Helmet><link rel="canonical" href="..." /></Helmet>: react-helmet-async keeps a single
// canonical link, and the page's Helmet, mounted later, wins.
const CanonicalLink = () => {
  const { pathname } = useLocation();
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl(pathname)} />
    </Helmet>
  );
};

export default CanonicalLink;
