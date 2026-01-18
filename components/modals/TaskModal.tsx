"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";

type FormState = {
  project: string;
  type: string;
  description: string;
  hours: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  date: string;
  timesheetId: string;
  initial?: Task | null;
  mode?: "create" | "edit" | "view";
  onSubmit: (payload: Omit<Task, "id"> & { id?: string }) => Promise<void>;
};

export default function TaskModal({
  open,
  onClose,
  date,
  timesheetId,
  initial,
  mode = "create",
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>({
    project: "",
    type: "",
    description: "",
    hours: 1,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        project: initial.project,
        type: initial.type,
        description: initial.description,
        hours: initial.hours,
      });
    } else {
      setForm({ project: "", type: "", description: "", hours: 1 });
    }
    setErrors([]);
    setSubmitting(false);
  }, [initial, open]);

  const validate = () => {
    if (mode === "view") return [];
    const next: string[] = [];
    if (!form.project) next.push("Project is required.");
    if (!form.type) next.push("Type of work is required.");
    if (!form.description) next.push("Task description is required.");
    if (Number.isNaN(form.hours) || form.hours < 0) next.push("Hours must be 0 or more.");
    return next;
  };

  const handleSubmit = async () => {
    if (mode === "view") {
      onClose();
      return;
    }
    const nextErrors = validate();
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        id: initial?.id,
        timesheetId,
        date,
        project: form.project,
        type: form.type,
        description: form.description,
        hours: form.hours,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrors(["Could not save the entry."]);
    } finally {
      setSubmitting(false);
    }
  };

  const isReadOnly = mode === "view";
  const title =
    mode === "view" ? "View Entry" : initial ? "Edit Entry" : "Add New Entry";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={form.project}
            onValueChange={(v) => setForm((f) => ({ ...f, project: v }))}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Project Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Homepage Development">Homepage Development</SelectItem>
              <SelectItem value="Dashboard">Dashboard</SelectItem>
              <SelectItem value="Landing Page">Landing Page</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.type}
            onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type of Work" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Bug fixes">Bug fixes</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Write text here..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            readOnly={isReadOnly}
          />

          {/* Hours */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={isReadOnly}
              onClick={() => setForm((f) => ({ ...f, hours: Math.max(0, f.hours - 1) }))}
            >
              -
            </Button>
            <Input
              className="w-16 text-center"
              value={form.hours}
              type="number"
              min={0}
              readOnly={isReadOnly}
              onChange={(e) =>
                setForm((f) => ({ ...f, hours: Math.max(0, Number(e.target.value)) }))
              }
            />
            <Button
              variant="outline"
              size="icon"
              disabled={isReadOnly}
              onClick={() => setForm((f) => ({ ...f, hours: f.hours + 1 }))}
            >
              +
            </Button>
          </div>

          {errors.length > 0 && (
            <div className="rounded-md bg-red-50 text-red-700 text-sm p-3">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode !== "view" && (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : initial ? "Save changes" : "Add entry"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
