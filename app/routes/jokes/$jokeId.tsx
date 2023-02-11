import type { LoaderArgs } from "@remix-run/node"
import { json } from '@remix-run/node'
import { useLoaderData } from "@remix-run/react"
import { db } from '~/utils/db.server'
import log, { Color } from '~/utils/log';


export const loader = async ({ params }: LoaderArgs) => {
    const { jokeId } = params;
    log(`Joke found: ${jokeId}`, Color.FgGreen);

    return json({
        joke: await db.joke.findUnique({ where: { id: jokeId } })
    })
}


export default function JokeRoute() {
    const { joke } = useLoaderData<typeof loader>();

    return (
        <p className="text-slate-500">{joke?.content}</p>
    )
}