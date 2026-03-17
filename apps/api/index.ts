function handler(_req: Request): Response {
  return new Response("Hello, World!");
}
Deno.serve({ port: 8001 }, handler);
