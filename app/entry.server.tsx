import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
// this is an optional export
// export const handleDataRequest: HandleDataRequestFunction =
//   (
//     response: Response,
//     // same args that get passed to the action or loader that was called
//     { request, params, context }
//   ) => {
//     console.log('REQUEST COMING IN')
//     response.headers.set("x-custom", "yay!");
//     return response;
//   };