import styles from './styles/app.css'
import type { MetaFunction } from "@remix-run/node";
import { LiveReload, Outlet, Scripts, Links, Link } from "@remix-run/react";
import { AiFillHome } from 'react-icons/ai'
import { GiCardJoker } from 'react-icons/gi'

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Links />
        <meta charSet="utf-8" />
        <title>My remix test</title>
        <Scripts />
      </head>
      <body className="p-10">
        <nav className="flex gap-x-4">
          <Link to="/" aria-label="home">
            <AiFillHome className="text-slate-500 text-4xl hover:text-slate-700" />
          </Link>
          <Link to="/jokes" aria-label="home">
            <GiCardJoker className="text-slate-500 text-4xl hover:text-slate-700" />
          </Link>
        </nav>
        <main className="main-outlet mt-4">
          <Outlet />
          <LiveReload />
        </main>
      </body>
    </html>
  );
}
