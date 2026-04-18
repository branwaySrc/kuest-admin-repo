export default function LogsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border rounded-3xl bg-muted/20">
      <h1 className="text-2xl font-bold">System Logs</h1>
      <p className="text-muted-foreground mt-2">Historical system operations and audit logs will be listed here.</p>
    </div>
  );
}
