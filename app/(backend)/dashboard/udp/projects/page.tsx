"use client";

import { Badge } from "@/components/ui/badge";
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

export default function ProjectsAdminPage() {
  const projects = useQuery(api.projects.list, {});
  const removeProject = useMutation(api.projects.remove);

  if (!projects) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Link href="/dashboard/udp/projects/create">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell className="font-medium">
                  {project.title}
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.year}</TableCell>
                <TableCell>
                  {project.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/udp/projects/${project._id}`}>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this project?")) {
                          removeProject({ id: project._id });
                        }
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
