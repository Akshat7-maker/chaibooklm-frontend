"use client";

import { useNotebooks } from "@/hooks/use-notebooks";
import { NotebookCard } from "@/components/notebooks/notebook-card";
import { CreateNotebookDialog } from "@/components/notebooks/create-notebook-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, AlertCircle } from "lucide-react";
import { notebooksApi } from "@/lib/api/notebooks";
import { useQueryClient } from "@tanstack/react-query";

export default function NotebooksPage() {
  const { data, isLoading, error } = useNotebooks();
  const notebooks = data?.notebooks;
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      await notebooksApi.remove(id);
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    } catch (err) {
      console.error("Failed to delete notebook:", err);
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-destructive" />}
          title="Failed to load notebooks"
          description="There was an error loading your notebooks. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Notebooks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and access all your research spaces.
          </p>
        </div>
        <CreateNotebookDialog>
          <Button size="lg" className="shrink-0 gap-2 font-medium">
            <Plus className="w-5 h-5" />
            New Notebook
          </Button>
        </CreateNotebookDialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-[200px] gap-4 p-6 border rounded-xl bg-card/50">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <Skeleton className="h-16 w-full mt-2" />
              <div className="mt-auto pt-4">
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notebooks && notebooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notebooks.map((notebook, index) => (
            <div
              key={notebook.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NotebookCard notebook={notebook} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-muted-foreground" />}
            title="No notebooks yet"
            description="Create your first notebook to start organizing your sources and asking questions."
            action={
              <CreateNotebookDialog>
                <Button size="lg" className="mt-4 gap-2">
                  <Plus className="w-5 h-5" />
                  Create First Notebook
                </Button>
              </CreateNotebookDialog>
            }
          />
        </div>
      )}
    </div>
  );
}