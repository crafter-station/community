"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SearchFilterProps = Readonly<{
  backgrounds: string[];
  totalCount: number;
}>;

export function SearchFilter({ backgrounds, totalCount }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentBackground = searchParams.get("background") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/directory?${params.toString()}`);
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", searchValue);
  }

  function clearFilters() {
    setSearchValue("");
    startTransition(() => {
      router.push("/directory");
    });
  }

  const hasFilters = currentSearch || currentBackground;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, bio, or skills..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>

      {/* Background filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        {backgrounds.map((bg) => (
          <Badge
            key={bg}
            variant={currentBackground === bg ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/20"
            onClick={() =>
              updateParams("background", currentBackground === bg ? "" : bg)
            }
          >
            {bg}
          </Badge>
        ))}
      </div>

      {/* Active filters & count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "member" : "members"}
          {hasFilters && " found"}
        </p>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
