export function GET() {
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /chathunka",
      "Disallow: /resume.pdf",
      "Disallow: /temp",
      "Sitemap: https://edgeintellab.com/sitemap-index.xml",
      "",
    ].join("\n"),
    {
      headers: { "Content-Type": "text/plain" },
    },
  );
}
