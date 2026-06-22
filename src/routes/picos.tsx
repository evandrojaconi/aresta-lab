import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/picos")({
  component: () => <Outlet />,
});
