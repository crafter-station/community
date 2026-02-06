"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type SearchFilterProps = Readonly<{
  backgrounds: string[];
  countries: string[];
  cities: string[];
  totalCount: number;
}>;

export function SearchFilter({
  backgrounds,
  countries,
  cities,
  totalCount,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentSearch = searchParams.get("search") ?? "";
  const currentBackground = searchParams.get("background") ?? "";
  const currentCountry = searchParams.get("country") ?? "";
  const currentCity = searchParams.get("city") ?? "";

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
    setIsFilterOpen(false);
  }

  const hasFilters =
    currentSearch || currentBackground || currentCountry || currentCity;

  const activeFilterCount = [
    currentBackground,
    currentCountry,
    currentCity,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search bar and filter button */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre, bio o skills..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </form>

      {/* Active filters display */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {currentBackground && (
            <Badge variant="default" className="gap-1">
              {currentBackground}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateParams("background", "")}
              />
            </Badge>
          )}
          {currentCountry && (
            <Badge variant="default" className="gap-1">
              {currentCountry}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateParams("country", "")}
              />
            </Badge>
          )}
          {currentCity && (
            <Badge variant="default" className="gap-1">
              {currentCity}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateParams("city", "")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground h-6 px-2"
          >
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {totalCount} {totalCount === 1 ? "miembro" : "miembros"}
        {hasFilters && " encontrados"}
      </p>

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent onClose={() => setIsFilterOpen(false)}>
          <DialogHeader>
            <DialogTitle>Filtros avanzados</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Background filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rol</label>
              <div className="flex flex-wrap gap-2">
                {backgrounds.map((bg) => (
                  <Badge
                    key={bg}
                    variant={currentBackground === bg ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                    onClick={() =>
                      updateParams(
                        "background",
                        currentBackground === bg ? "" : bg,
                      )
                    }
                  >
                    {bg}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Country filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">País</label>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <Badge
                    key={country}
                    variant={currentCountry === country ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                    onClick={() =>
                      updateParams(
                        "country",
                        currentCountry === country ? "" : country,
                      )
                    }
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>

            {/* City filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad</label>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Badge
                    key={city}
                    variant={currentCity === city ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/20"
                    onClick={() =>
                      updateParams("city", currentCity === city ? "" : city)
                    }
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
            <Button onClick={() => setIsFilterOpen(false)}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
