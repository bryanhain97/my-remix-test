import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { db } from "~/utils/db.server"

export const loader = async ({ params }: LoaderArgs) => {
    return json({
        jokesItemList: await db.joke.findMany({})
    })
}

export default function Jokes() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="jokes">
            <h2 className="text-2xl uppercase underline mb-6 text-slate-500">Click to see joke:</h2>
            {data.jokesItemList.map(({ id, name }) => {
                return (
                    <div key={id} className="joke flex align-bottom h-10">
                        <Link to={id}>
                            <span className="text-lg text-slate-600 text">{name}</span>
                        </Link>
                    </div>
                )
            })}
            <Link to="/jokes/new">
                <button className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mt-4" aria-label="Create Joke">
                    Create Joke
                </button>
            </Link>
        </div>
    )
}