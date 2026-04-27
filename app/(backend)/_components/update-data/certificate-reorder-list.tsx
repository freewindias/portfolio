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
import { GripVertical, Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateCertificatesOrder } from "@/server/certificates";
import { toast } from "sonner";

interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  link: string | null;
}

interface CertificateReorderListProps {
  initialCertificates: Certificate[];
}

export function CertificateReorderList({ initialCertificates }: CertificateReorderListProps) {
  const [certificates, setCertificates] = useState(initialCertificates);
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
      setCertificates((items) => {
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
      const certificateIds = certificates.map((c) => c.id);
      const result = await updateCertificatesOrder(certificateIds);
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
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Subtitle</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <SortableContext
                  items={certificates.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {certificates.map((certificate) => (
                    <SortableCertificateRow key={certificate.id} certificate={certificate} />
                  ))}
                </SortableContext>
                {certificates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No certificates found.
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

function SortableCertificateRow({ certificate }: { certificate: Certificate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: certificate.id });

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
        <div className="flex flex-col">
          <span className="line-clamp-1 text-base">{certificate.title}</span>
          {certificate.link && (
            <a 
              href={certificate.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View Link
            </a>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-muted-foreground">{certificate.subtitle}</td>
      <td className="px-6 py-4 whitespace-nowrap">{certificate.date}</td>
      <td className="px-6 py-4 text-right">
        <Link href={`/dashboard/update/certificates/${certificate.id}`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </td>
    </tr>
  );
}
