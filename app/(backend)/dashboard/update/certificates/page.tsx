import { getCertificates } from "@/server/certificates";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CertificateReorderList } from "@/app/(backend)/_components/update-data/certificate-reorder-list";

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="flex flex-col gap-6 px-4 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates & Publications</h1>
          <p className="text-muted-foreground mt-1">
            Manage your certificates, research papers, and publications. Drag to reorder.
          </p>
        </div>
        <Link href="/dashboard/update/certificates/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </Link>
      </div>

      <CertificateReorderList initialCertificates={certificates} />
    </div>
  );
}
