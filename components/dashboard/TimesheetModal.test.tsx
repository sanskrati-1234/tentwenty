import { render, screen, fireEvent } from "@testing-library/react";
import TimesheetModal from "./TimesheetModal";

describe("TimesheetModal", () => {
  it("shows validation errors when submitting empty form", async () => {
    const onSubmit = vi.fn();

    render(
      <TimesheetModal
        open
        onClose={() => {}}
        initial={null}
        onSubmit={onSubmit}
      />,
    );

    const button = screen.getByRole("button", { name: /add timesheet/i });
    fireEvent.click(button);

    expect(await screen.findByText(/week is required/i)).toBeInTheDocument();
    expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/end date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/total hours must be 0 or more/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
