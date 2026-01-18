"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Timesheet, TimesheetStatus } from "@/types/timesheet";

type FormState = {
  week: string;
  startDate: string;
  endDate: string;
  totalHours: string;
  status: TimesheetStatus;
  notes: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Timesheet | null;
  onSubmit: (payload: {
    week: number;
    startDate: string;
    endDate: string;
    totalHours: number;
    status: TimesheetStatus;
    notes?: string;
  }) => Promise<void>;
};

export default function TimesheetModal({ open, onClose, initial, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>({
    week: "",
    startDate: "",
    endDate: "",
    totalHours: "",
    status: "incomplete",
    notes: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        week: String(initial.week),
        startDate: initial.startDate,
        endDate: initial.endDate,
        totalHours: String(initial.totalHours),
        status: initial.status,
        notes: initial.notes ?? "",
      });
    } else {
      setForm({
        week: "",
        startDate: "",
        endDate: "",
        totalHours: "",
        status: "incomplete",
        notes: "",
      });
    }
    setErrors([]);
    setSubmitting(false);
  }, [initial, open]);

  const title = useMemo(() => {
    if (!initial) return "Add Timesheet";
    if (initial.status === "missing") return "Create Timesheet";
    if (initial.status === "incomplete") return "Update Timesheet";
    return "View / Edit Timesheet";
  }, [initial]);

  const validate = () => {
    const nextErrors: string[] = [];
    const weekNum = Number(form.week);
    if (!form.week || Number.isNaN(weekNum) || weekNum < 1) {
      nextErrors.push("Week is required and must be greater than 0.");
    }
    if (!form.startDate) nextErrors.push("Start date is required.");
    if (!form.endDate) nextErrors.push("End date is required.");
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (start > end) nextErrors.push("Start date must be before end date.");
    }
    const hoursNum = Number(form.totalHours);
    if (form.totalHours === "" || Number.isNaN(hoursNum) || hoursNum < 0) {
      nextErrors.push("Total hours must be 0 or more.");
    }
    return { nextErrors, weekNum, hoursNum };
  };

  const handleSubmit = async () => {
    const { nextErrors, weekNum, hoursNum } = validate();
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors([]);
    try {
      await onSubmit({
        week: weekNum,
        startDate: form.startDate,
        endDate: form.endDate,
        totalHours: hoursNum,
        status: form.status,
        notes: form.notes || undefined,
      });
      onClose();
    } catch (error) {
      console.error(error);
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Week #</label>
              <Input
                type="number"
                min={1}
                value={form.week}
                onChange={(e) => setForm((f) => ({ ...f, week: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((f) => ({ ...f, status: value as TimesheetStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Start date</label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">End date</label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Total hours</label>
              <Input
                type="number"
                min={0}
                value={form.totalHours}
                onChange={(e) => setForm((f) => ({ ...f, totalHours: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Notes</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
              />
            </div>
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
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save changes" : "Add timesheet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
