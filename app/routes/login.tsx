import type {
    ActionArgs,
    LinksFunction,
} from "@remix-run/node";
import {
    Link,
    useActionData,
    useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import log, { Color } from "~/utils/log";
import { badRequest } from "~/utils/request.server";
import { login, createUserSession } from '~/utils/session.server';

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl },
];


export const action = async ({ request }: ActionArgs) => {

    const form = await request.formData();
    const loginType = form.get("loginType");
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = validateUrl(form.get("redirectTo") as string || "/jokes");

    if (
        typeof loginType !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof redirectTo !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: `Form not submitted correctly.`,
        });
    }
    const fields = { loginType, username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fieldErrors,
            fields,
            formError: null,
        });
    }
    switch (loginType) {
        case "login": {
            const user = await login({ username, password });
            if (!user) {
                return badRequest({
                    fieldErrors,
                    fields,
                    formError: 'Username or Password incorrect.'
                })
            }
            log({ user }, Color.FgBlue);
            return createUserSession(user.id, redirectTo)
        }
        case "register": {
            const userExists = await db.user.findFirst({
                where: { username },
            });
            if (userExists) {
                return badRequest({
                    fieldErrors: null,
                    fields,
                    formError: `User with username ${username} already exists`,
                });
            }
            return badRequest({
                fieldErrors: null,
                fields,
                formError: "Not implemented",
            });
        }
        default: {
            return badRequest({
                fieldErrors: null,
                fields,
                formError: `Login type invalid`,
            });
        }
    }
};

export default function Login() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();
    return (
        <div className="container">
            <div className="content" data-light="">
                <h1 className="text-slate-700 text-2xl font-bold mb-6">Login</h1>
                <form method="post" className="w-full flex flex-col">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={searchParams.get("redirectTo") ?? undefined}
                    />
                    <fieldset className="mb-4">
                        <legend className="sr-only">
                            Login or Register?
                        </legend>
                        <label
                            className="font-medium text-slate-600 hover:cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType ||
                                    actionData?.fields?.loginType === "login"
                                }
                            />{" "}
                            Login
                        </label>
                        <label
                            className="font-medium text-slate-600 hover:cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={
                                    actionData?.fields?.loginType ===
                                    "register"
                                }
                            />{" "}
                            Register
                        </label>
                    </fieldset>
                    <div className="flex justify-between mb-2 flex-col">
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            className="rounded-xl px-3"
                            id="username-input"
                            name="username"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.username
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                    ? "username-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p
                                className="form-validation-error text-xs text-red-500 mt-1"
                                role="alert"
                                id="username-error"
                            >
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex justify-between flex-col">
                        <label htmlFor="password-input">Password</label>
                        <input
                            className="rounded-xl px-3"
                            id="password-input"
                            name="password"
                            type="password"
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.password
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                    ? "password-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.password ? (
                            <p
                                className="form-validation-error text-xs text-red-500 mt-1"
                                role="alert"
                                id="password-error"
                            >
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>
                    <div id="form-error-message">
                        {actionData?.formError ? (
                            <p
                                className="form-validation-error text-xs text-red-500 mt-1"
                                role="alert"
                            >
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" className="button bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-6">
                        Submit
                    </button>
                </form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}



function validateUsername(username: unknown) {
    if (typeof username !== "string" || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== "string" || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

function validateUrl(url: string) {
    let urls = ["/jokes", "/", "https://remix.run"];
    if (urls.includes(url)) {
        return url;
    }
    return "/jokes";
}
