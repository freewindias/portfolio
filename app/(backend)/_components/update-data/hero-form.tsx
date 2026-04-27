"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { heroSchema, type HeroValues } from "@/lib/validations/hero";
import { updateHeroData } from "@/server/hero";
import { toast } from "sonner";
import { Loader2, Upload, X, Image as ImageIcon, FileText, Eye } from "lucide-react";
import Image from "next/image";

interface HeroFormProps {
  initialData: any;
}

export function HeroForm({ initialData }: HeroFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerUrl || "/images/hero-sec/banner-bg-img.png");
  const [profilePreview, setProfilePreview] = useState<string | null>(initialData?.profileUrl || "/images/hero-sec/user-img.png");
  const [resumeFileName, setResumeFileName] = useState<string | null>(initialData?.resumeUrl ? "Current Resume Uploaded" : null);
  const [resumePreview, setResumePreview] = useState<string | null>(initialData?.resumeUrl || null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HeroValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: initialData?.name || "Freewin Dias",
      role: initialData?.role || "Game & Web Developer",
      location: initialData?.location || "Vancouver, BC",
      githubUrl: initialData?.githubUrl || "https://github.com/freewindias",
      linkedinUrl: initialData?.linkedinUrl || "https://linkedin.com/in/freewindias",
      mailEmail: initialData?.mailEmail || "mailto:[EMAIL_ADDRESS]",
      existingBannerUrl: initialData?.bannerUrl || "/images/hero-sec/banner-bg-img.png",
      existingProfileUrl: initialData?.profileUrl || "/images/hero-sec/user-img.png",
      existingResumeUrl: initialData?.resumeUrl || "/resume.pdf",
    },
  });

  const onSubmit = async (values: HeroValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("role", values.role || "");
      formData.append("location", values.location || "");
      formData.append("githubUrl", values.githubUrl || "");
      formData.append("linkedinUrl", values.linkedinUrl || "");
      formData.append("mailEmail", values.mailEmail || "");
      formData.append("existingBannerUrl", values.existingBannerUrl || "");
      formData.append("existingProfileUrl", values.existingProfileUrl || "");
      formData.append("existingResumeUrl", values.existingResumeUrl || "");
      
      if (values.banner) {
        formData.append("banner", values.banner);
      }
      if (values.profile) {
        formData.append("profile", values.profile);
      }
      if (values.resume) {
        formData.append("resume", values.resume);
      }

      const result = await updateHeroData(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("banner", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("resume", file);
      setResumeFileName(file.name);
      setResumePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Banner Section */}
        <div className="space-y-4 md:col-span-2">
          <FieldLabel>Banner Image</FieldLabel>
          <div 
            className="relative w-full h-72 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerPreview ? (
              <Image 
                src={bannerPreview} 
                alt="Banner preview" 
                fill 
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover" 
                unoptimized // In case it's a data URL
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload size={32} />
                <span>Upload Banner</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white font-medium">Change Banner</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={bannerInputRef} 
            onChange={handleBannerChange} 
            accept="image/*" 
            className="hidden" 
          />
          <FieldDescription>Recommended size: 1080x270px</FieldDescription>
        </div>

        {/* Profile Image Section */}
        <div className="space-y-4 md:col-span-2">
          <FieldLabel>Profile Image</FieldLabel>
          <div className="flex items-center gap-6">
            <div 
              className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              onClick={() => profileInputRef.current?.click()}
            >
              {profilePreview ? (
                <Image 
                  src={profilePreview} 
                  alt="Profile preview" 
                  fill 
                  sizes="128px"
                  className="object-cover"
                  unoptimized 
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-500">
                  <Upload size={24} />
                  <span className="text-xs">Upload</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => profileInputRef.current?.click()}
              >
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Square images work best (e.g., 400x400px)
              </p>
            </div>
          </div>
          <input 
            type="file" 
            ref={profileInputRef} 
            onChange={handleProfileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="name">Display Name</FieldLabel>
          <Input id="name" placeholder="Your Name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="role">Role / Title</FieldLabel>
          <Input id="role" placeholder="Game & Web Developer" {...register("role")} />
          <FieldError errors={[errors.role]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input id="location" placeholder="City, Country" {...register("location")} />
          <FieldError errors={[errors.location]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="mailEmail">Mail Email</FieldLabel>
          <Input id="mailEmail" placeholder="mailto:your@email.com" {...register("mailEmail")} />
          <FieldError errors={[errors.mailEmail]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="githubUrl">GitHub URL</FieldLabel>
          <Input id="githubUrl" placeholder="https://github.com/..." {...register("githubUrl")} />
          <FieldError errors={[errors.githubUrl]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
          <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
          <FieldError errors={[errors.linkedinUrl]} />
        </Field>
      </div>

      <div className="space-y-4">
        <FieldLabel>Resume File (PDF)</FieldLabel>
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => resumeInputRef.current?.click()}
          >
            <FileText className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>

          {resumePreview && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.open(resumePreview, '_blank')}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Document
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            {resumeFileName || "No file selected"}
          </span>
          <input 
            type="file" 
            ref={resumeInputRef} 
            onChange={handleResumeChange} 
            accept=".pdf" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-black text-white hover:bg-black/90 px-8"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
