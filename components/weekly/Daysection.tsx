import TaskRow from "./TaskRow";
import AddTaskButton from "./AddTaskButton";
import { Task } from "@/types/task";

type Props = {
  date: string;
  tasks: Task[];
  timesheetId: string;
  onAdd: (payload: Omit<Task, "id">) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
};

export default function DaySection({
  date,
  tasks,
  timesheetId,
  onAdd,
  onDelete,
  onEdit,
  onView,
}: Props) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <div className="text-sm font-medium">
        {new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onView={onView}
          />
        ))}

        <AddTaskButton date={date} timesheetId={timesheetId} onAdd={onAdd} />
      </div>
    </div>
  );
}
