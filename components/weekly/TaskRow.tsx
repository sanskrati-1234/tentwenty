import { Task } from "@/types/task";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function TaskRow({
  task,
  onDelete,
  onEdit,
  onView,
}: {
  task: Task;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
}) {
  return (
    <div className="flex items-center justify-between border rounded-lg px-4 py-2">
      <span className="text-sm">{task.description}</span>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">{task.hours} hrs</span>
        <Badge variant="secondary">{task.project}</Badge>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onView(task)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
