/** Preserve the existing icon URL without generating another metadata link. */
export function GET(request: Request) {
  return Response.redirect(
    new URL("/brand/bomgichul-icon-96.png", request.url),
    308
  );
}
