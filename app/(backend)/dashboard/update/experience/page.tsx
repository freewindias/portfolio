import { getExperiences } from "@/server/experiences";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="flex flex-col gap-6 px-4 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage your work experiences and timeline.
          </p>
        </div>
        <Link href="/dashboard/update/experience/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </Link>
      </div>

      <div className="border rounded-md mt-4 overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Role & Company</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <p className="mb-4">No experiences found. Add your first experience to showcase your journey.</p>
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-4">
                      {exp.iconUrl ? (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted/20 shrink-0 flex items-center justify-center p-2">
                          <Image
                            src={exp.iconUrl}
                            alt={exp.role}
                            width={30}
                            height={30}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted border flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-muted-foreground uppercase">none</span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="line-clamp-1 text-base">{exp.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{exp.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exp.startYear} – {exp.endYear}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/update/experience/${exp.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
