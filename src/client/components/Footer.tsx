import { Link } from '@tanstack/react-router';
import { memo } from 'react';

export default memo(function Footer() {
  return (
    <footer className="footer footer-center bg-base-200/20 text-neutral-content rounded p-4 gap-4 shrink-0 self-stretch">
      <aside>
        <p className="font-semibold">
          Logic Pad v{import.meta.env.VITE_PACKAGE_VERSION}
        </p>
        <p>
          Copyright © {new Date().getFullYear()} -{' '}
          <a
            className="link link-hover"
            href="https://github.com/hlysine/logic-pad"
            target="_blank"
            rel="noreferrer"
          >
            See LICENSE for details
          </a>
        </p>
      </aside>
      <nav className="grid grid-flow-col gap-8">
        <Link to="/rules" className="link link-hover">
          Rules
        </Link>
        <Link to="/privacy-policy" className="link link-hover">
          Privacy policy
        </Link>
        <a
          className="link link-hover"
          href="https://github.com/hlysine/logic-pad"
          target="_blank"
          rel="noreferrer"
        >
          Source code
        </a>
        <a className="link link-hover" href="mailto:logic-pad@googlegroups.com">
          Email
        </a>
      </nav>
    </footer>
  );
});
