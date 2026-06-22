export const SITE_URL = "https://arestaclimb.com";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface PageSeoInput {
  title: string;
  description: string;
  path: string; // leading slash, e.g. "/picos"
  ogType?: "website" | "article";
  image?: string;
}

export function pageHead({
  title,
  description,
  path,
  ogType = "website",
  image = OG_IMAGE,
}: PageSeoInput) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: ogType },
      { property: "og:image", content: image },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
