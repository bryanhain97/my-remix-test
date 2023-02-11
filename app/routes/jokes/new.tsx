import { Form } from "@remix-run/react"
import { redirect } from "@remix-run/node"
import type { ActionArgs } from '@remix-run/node'
import { db } from "~/utils/db.server"
import log, { Color } from "~/utils/log";


export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const name = formData.get('name')
    const content = formData.get('content')
    if (
        typeof name !== 'string' ||
        typeof content !== 'string'
    ) {
        throw new Error('Form not submitted correctly!');
    }

    const newJoke = { name, content };
    const joke = await db.joke.create({ data: newJoke });
    log(`Joke created: ${joke.id}`, Color.FgGreen)
    return redirect(`/jokes/`);
}

export default function NewJokeRoute() {
    // <Form /> doesn't need a action property since by default the post request is going to the same URL => // /jokes/new
    return (
        <div>
            <div>
                <p>Add your own hilarious joke</p>
                <form method="post">
                    <div>
                        <label>
                            Name: <input type="text" name="name" />
                        </label>
                    </div>
                    <div>
                        <label>
                            Content: <textarea name="content" />
                        </label>
                    </div>
                    <div>
                        <button type="submit" className="button">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
