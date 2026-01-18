import { render, screen, fireEvent } from "@testing-library/react";
import TaskModal from "./TaskModal";

describe("TaskModal", () => {
  it("shows validation errors when submitting empty form", async () => {
    const onSubmit = vi.fn();

    render(
      <TaskModal
        open
        onClose={() => {}}
        date="2024-01-01"
        timesheetId="123"
        onSubmit={onSubmit}
      />,
    );

    const button = screen.getByRole("button", { name: /add entry/i });
    fireEvent.click(button);

    expect(await screen.findByText(/project is required/i)).toBeInTheDocument();
    expect(screen.getByText(/type of work is required/i)).toBeInTheDocument();
    expect(screen.getByText(/task description is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
