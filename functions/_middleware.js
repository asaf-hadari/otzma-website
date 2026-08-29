export async function onRequest(context) {
  const { request, env, next } = context;
  const expectedPassword = env.SITE_PASSWORD;

  if (!expectedPassword) {
    return new Response("Site password is not configured (missing SITE_PASSWORD env var).", { status: 500 });
  }

  const auth = request.headers.get("Authorization");
  if (auth && auth.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const password = separatorIndex === -1 ? decoded : decoded.slice(separatorIndex + 1);
    if (password === expectedPassword) {
      return next();
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
  });
}
