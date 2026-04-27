import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CertificateForm } from "@/app/(backend)/_components/update-data/certificate-form";
import { getCertificateById } from "@/server/certificates";
import { notFound } from "next/navigation";

interface EditCertificatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  const { id } = await params;
  const certificate = await getCertificateById(id);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 px-4 w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/update/certificates">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Certificate</h1>
          <p className="text-muted-foreground">
            Update details for your certificate or publication.
          </p>
        </div>
      </div>
      <CertificateForm initialData={certificate} />
    </div>
  );
}
