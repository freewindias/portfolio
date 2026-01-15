"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { TrashIcon, PlusIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EducationAdminPage() {
  const educations = useQuery(api.education.get);
  const removeEducation = useMutation(api.education.remove);

  if (!educations) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Education</h1>
        <Link href="/dashboard/udp/education/create">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degrees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educations.map((education) => (
              <TableRow key={education._id}>
                <TableCell className="font-medium">
                  {education.institutionName}
                </TableCell>
                <TableCell>
                  {education.degrees.map((d) => d.degree).join(", ")}
                </TableCell>
                <TableCell>
                  {education.isCurrentEmployer ? "Current" : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/udp/education/${education._id}`}>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          removeEducation({ id: education._id });
                        }
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {educations.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No education entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
