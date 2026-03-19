import { serveDir, serveFile } from "@std/http/file-server";

Deno.serve(async (req) => {
  const res = await serveDir(req, { fsRoot: "dist/" });
  if (res.status === 404) {
    return serveFile(req, "dist/index.html");
  }
  return res;
});