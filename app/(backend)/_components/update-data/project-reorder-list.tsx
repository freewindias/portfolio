"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateProjectsOrder } from "@/server/projects";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string | null;
  image: string | null;
  featured: boolean;
}

interface ProjectReorderListProps {
  initialProjects: Project[];
}

export function ProjectReorderList({ initialProjects }: ProjectReorderListProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [hasChanged, setHasChanged] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanged(true);
        return newItems;
      });
    }
  }

  async function handleSave() {
    startTransition(async () => {
      const projectIds = projects.map((p) => p.id);
      const result = await updateProjectsOrder(projectIds);
      if (result.success) {
        toast.success(result.message);
        setHasChanged(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      {hasChanged && (
        <div className="flex justify-end sticky top-0 z-10 py-2 bg-background/80 backdrop-blur-sm">
          <Button onClick={handleSave} disabled={isPending} className="shadow-lg">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Order
          </Button>
        </div>
      )}

      <div className="border rounded-md overflow-hidden bg-background shadow-sm">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground border-b uppercase text-xs">
                <tr>
                  <th className="w-10 px-4 py-4"></th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Year</th>
                  <th className="px-6 py-4 font-semibold">Featured</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <SortableContext
                  items={projects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {projects.map((project) => (
                    <SortableProjectRow key={project.id} project={project} />
                  ))}
                </SortableContext>
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

function SortableProjectRow({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 0,
    position: 'relative' as const,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "bg-muted shadow-xl border-y z-20" : "bg-background hover:bg-muted/30"} transition-colors`}
    >
      <td className="px-4 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="px-6 py-4 font-medium">
        <div className="flex items-center gap-4">
          {project.image ? (
            <div className="relative w-16 h-12 rounded-md overflow-hidden border shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-12 rounded-md bg-muted border flex items-center justify-center shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase">none</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="line-clamp-1 text-base">{project.title}</span>
            <span className="text-xs text-muted-foreground font-normal">{project.slug}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{project.category}</td>
      <td className="px-6 py-4">{project.year || "-"}</td>
      <td className="px-6 py-4">
        {project.featured ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Featured
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
            Standard
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <Link href={`/dashboard/update/projects/${project.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </td>
    </tr>
  );
}
