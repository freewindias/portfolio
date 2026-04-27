"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { certificateSchema, type CertificateValues } from "@/lib/validations/certificate";
import { saveCertificate, deleteCertificate } from "@/server/certificates";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CertificateFormProps {
  initialData?: any;
}

export function CertificateForm({ initialData }: CertificateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      date: initialData?.date || "",
      link: initialData?.link || "",
    },
  });

  const onSubmit = async (values: CertificateValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (values.id) formData.append("id", values.id);
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle);
      formData.append("date", values.date);
      if (values.link) formData.append("link", values.link);

      const result = await saveCertificate(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/certificates");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const result = await deleteCertificate(initialData.id);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/certificates");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting certificate");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" placeholder="E.g., Bachelor's in Computer Engineering" {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="subtitle">Subtitle / Organization</FieldLabel>
          <Input id="subtitle" placeholder="E.g., St. John College of Engineering & Management" {...register("subtitle")} />
          <FieldError errors={[errors.subtitle]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="date">Date / Duration</FieldLabel>
          <Input id="date" placeholder="E.g., July 2020 - June 2024" {...register("date")} />
          <FieldError errors={[errors.date]} />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="link">Link (Optional)</FieldLabel>
          <Input id="link" placeholder="E.g., https://coursera.org/..." {...register("link")} />
          <FieldError errors={[errors.link]} />
        </Field>
      </div>

      <div className="flex items-center gap-2 pt-8 border-t">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/dashboard/update/certificates")}
            disabled={isLoading || isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isDeleting} 
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Certificate"}
          </Button>
        </div>
        {initialData?.id ? (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete Certificate
          </Button>
        ) : (
          <div /> 
        )}
      </div>
    </form>
  );
}
