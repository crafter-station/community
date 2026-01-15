"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, X } from "lucide-react";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhotoUpload } from "@/components/shared/photo-upload";
import {
  createProfile,
  updateProfile,
  checkSlugAvailability,
} from "@/actions/profile";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/lib/validations";
import { BIO_MAX_LENGTH, BACKGROUND_SUGGESTIONS } from "@/lib/constants";
import type { Profile } from "@/db/schema";

type ProfileFormProps = Readonly<{
  mode: "create" | "edit";
  initialData?: Profile;
}>;

export function ProfileForm({ mode, initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl ?? "");
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      slug: initialData?.slug ?? "",
      bio: initialData?.bio ?? "",
      background: initialData?.background ?? "",
      country: initialData?.country ?? "",
      city: initialData?.city ?? "",
      workingOn: initialData?.workingOn ?? "",
      lookingFor: initialData?.lookingFor ?? "",
      linkedinUrl: initialData?.linkedinUrl ?? "",
      twitterUrl: initialData?.twitterUrl ?? "",
      githubUrl: initialData?.githubUrl ?? "",
      websiteUrl: initialData?.websiteUrl ?? "",
      askMeAbout: initialData?.askMeAbout ?? "",
    },
  });

  const watchedName = form.watch("fullName");
  const watchedSlug = form.watch("slug");
  const watchedBio = form.watch("bio");

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (mode === "create" && watchedName && !form.getValues("slug")) {
      const generatedSlug = slugify(watchedName, { lower: true, strict: true });
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, mode, form]);

  // Check slug availability with debounce
  useEffect(() => {
    if (!watchedSlug || watchedSlug.length < 3) {
      setSlugStatus("idle");
      return;
    }

    // Skip if it's the user's current slug in edit mode
    if (mode === "edit" && watchedSlug === initialData?.slug) {
      setSlugStatus("available");
      return;
    }

    setSlugStatus("checking");
    const timeout = setTimeout(async () => {
      const isAvailable = await checkSlugAvailability(
        watchedSlug,
        initialData?.clerkUserId
      );
      setSlugStatus(isAvailable ? "available" : "taken");
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedSlug, mode, initialData?.slug, initialData?.clerkUserId]);

  async function onSubmit(data: ProfileFormValues) {
    if (!photoUrl) {
      setSubmitError("Please upload a profile photo");
      return;
    }

    if (slugStatus === "taken") {
      setSubmitError("Please choose a different URL");
      return;
    }

    setSubmitError(null);

    startTransition(async () => {
      const payload = { ...data, photoUrl };
      const result =
        mode === "create"
          ? await createProfile(payload)
          : await updateProfile(payload);

      if (result.success) {
        router.push(`/${result.data.slug}`);
      } else {
        setSubmitError(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Photo Upload */}
        <div className="space-y-2">
          <FormLabel>Profile Photo *</FormLabel>
          <PhotoUpload
            value={photoUrl}
            onChange={setPhotoUrl}
            disabled={isPending}
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile URL *</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      crafterstation.com/
                    </span>
                    <div className="relative flex-1">
                      <Input
                        placeholder="john-doe"
                        {...field}
                        disabled={isPending}
                        className="pr-8"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {slugStatus === "checking" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {slugStatus === "available" && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        {slugStatus === "taken" && (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Only lowercase letters, numbers, and hyphens.
                </FormDescription>
                {slugStatus === "taken" && (
                  <p className="text-sm text-destructive">
                    This URL is already taken
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  One-line Bio *{" "}
                  <span className="text-muted-foreground">
                    ({watchedBio.length}/{BIO_MAX_LENGTH})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Building the future of..."
                    maxLength={BIO_MAX_LENGTH}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Background & Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Background & Location</h3>

          <FormField
            control={form.control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background/Role *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Engineering, Design, Founder..."
                    list="background-suggestions"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <datalist id="background-suggestions">
                  {BACKGROUND_SUGGESTIONS.map((bg) => (
                    <option key={bg} value={bg} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="United States"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="San Francisco"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* What you're working on */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Work</h3>

          <FormField
            control={form.control}
            name="workingOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you working on?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I'm building an AI-powered productivity tool that..."
                    rows={3}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lookingFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you looking for?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Co-founder, feedback, collaborators..."
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="askMeAbout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ask me about...</FormLabel>
                <FormControl>
                  <Input
                    placeholder="React, TypeScript, startups, hiking..."
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Conversation starters for people who want to connect
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter/X</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://x.com/..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit */}
        {submitError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {submitError}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending || slugStatus === "taken"}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Create Profile"
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
