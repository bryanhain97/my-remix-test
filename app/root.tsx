import styles from './styles/app.css'
import type { MetaFunction } from "@remix-run/node";
import { LiveReload, Outlet, Scripts, Links } from "@remix-run/react";


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
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
