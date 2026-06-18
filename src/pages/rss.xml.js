import { getCollection } from "astro:content";

export async function GET() {
  const posts = (await getCollection("posts")).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  const items = posts
    .map(
      (post) => `<item>
  <title><![CDATA[${post.data.title}]]></title>
  <description><![CDATA[${post.data.description}]]></description>
  <link>https://edgeintellab.com/articles/${post.id}</link>
  <guid>https://edgeintellab.com/articles/${post.id}</guid>
  <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
</item>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>EdgeIntellab</title>
  <link>https://edgeintellab.com</link>
  <description>Embedded systems, edge AI, robotics, electronics, Linux, IoT, and software engineering.</description>
  ${items}
</channel>
</rss>`,
    {
      headers: { "Content-Type": "application/rss+xml" },
    },
  );
}
