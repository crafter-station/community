import { Github, Linkedin, Twitter, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

type SocialLinksProps = Readonly<{
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}>;

export function SocialLinks({
  linkedinUrl,
  twitterUrl,
  githubUrl,
  websiteUrl,
}: SocialLinksProps) {
  const links = [
    { url: linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { url: twitterUrl, icon: Twitter, label: "Twitter/X" },
    { url: githubUrl, icon: Github, label: "GitHub" },
    { url: websiteUrl, icon: Globe, label: "Website" },
  ].filter((link) => link.url);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {links.map(({ url, icon: Icon, label }) => (
        <Button
          key={label}
          variant="outline"
          size="icon"
          asChild
          className="h-9 w-9"
        >
          <a
            href={url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
    </div>
  );
}
