import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

function validateJokeContent(content: string) {
    if (content.length < 10) {
        return `That joke is too short`;
    }
}

function validateJokeName(name: string) {
    if (name.length < 3) {
        return `That joke's name is too short`;
    }
}

export const action = async ({ request, context, params }: ActionArgs) => {

    const form = await request.formData();
    const name = form.get("name");
    const content = form.get("content");

    if (
        typeof name !== "string" ||
        typeof content !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: `Form not submitted correctly.`,
        });
    }

    const fieldErrors = {
        name: validateJokeName(name),
        content: validateJokeContent(content),
    };
    const fields = { name, content };
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fieldErrors,
            fields,
            formError: null,
        });
    }

    const joke = await db.joke.create({ data: fields });
    return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="shadow-md bg-yellow-200 rounded-xl p-3 max-w-fit">
            <p className="text-2xl mb-4">Add your own hilarious joke</p>
            <form method="post">
                <div>
                    <label>
                        Name:{" "}
                        <input
                            type="text"
                            defaultValue={actionData?.fields?.name}
                            name="name"
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.name) ||
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.name
                                    ? "name-error"
                                    : undefined
                            }
                        />
                    </label>
                    {actionData?.fieldErrors?.name ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                            id="name-error"
                        >
                            {actionData.fieldErrors.name}
                        </p>
                    ) : null}
                </div>
                <div>
                    <label>
                        Content:{" "}
                        <textarea
                            defaultValue={actionData?.fields?.content}
                            name="content"
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.content) ||
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.content
                                    ? "content-error"
                                    : undefined
                            }
                        />
                    </label>
                    {actionData?.fieldErrors?.content ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                            id="content-error"
                        >
                            {actionData.fieldErrors.content}
                        </p>
                    ) : null}
                </div>
                <div>
                    {actionData?.formError ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                        >
                            {actionData.formError}
                        </p>
                    ) : null}
                    <button type="submit" className="button bg-green-600 w-fit py-1 px-4 rounded-md mt-4 text-white font-medium">
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}