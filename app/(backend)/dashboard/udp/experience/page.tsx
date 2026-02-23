"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export default function ExperienceAdminPage() {
  const experiences = useQuery(api.experience.get);
  const removeExperience = useMutation(api.experience.remove);

  if (!experiences) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Experiences</h1>
        <Link href="/dashboard/udp/experience/create">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience._id}>
                <TableCell className="font-medium">
                  {experience.companyName}
                  {experience.isCurrentEmployer && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500" />
                  )}
                </TableCell>
                <TableCell>
                  {experience.positions.map((p) => p.title).join(", ")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/udp/experience/${experience._id}`}>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          removeExperience({ id: experience._id });
                        }
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {experiences.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No experiences found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
