"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MoreHorizontal, BookOpen, Trash2 } from "lucide-react";
import { Notebook } from "@/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NotebookCardProps {
  notebook: Notebook;
  onDelete?: (id: string) => void;
}

export function NotebookCard({ notebook, onDelete }: NotebookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(notebook.id);
    }
  };

  return (
    <Link href={`/notebook/${notebook.id}`} className="block h-full group">
      <Card className={cn(
        "h-full flex flex-col hover-lift animate-scale-in",
        "border border-border/50 bg-card/50 glass hover:bg-card hover:border-border transition-all duration-300"
      )}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2 truncate">
            <div className="p-2 bg-primary/10 rounded-md shrink-0">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium truncate group-hover:text-primary transition-colors">
              {notebook.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.preventDefault()} render={
              <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground mt-2">
            {notebook.description || "No description provided."}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Created {format(new Date(notebook.createdAt), "MMM d, yyyy")}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
