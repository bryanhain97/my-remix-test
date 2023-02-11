import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import stylesUrl from "~/styles/jokes.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
};


export default function JokesRoute() {
    return (
        <div className="jokes-route">
            <header>
                <h1 className="text-4xl text-center mb-9 text-slate-600">
                    <Link to="/jokes">
                        Jokes
                    </Link>
                </h1>
            </header>
            <main className="jokes-outlet">
                <Outlet />
            </main>
        </div>
    )
}