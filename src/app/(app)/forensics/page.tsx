import ForensicsForm from "./forensics-form";

export default function ForensicsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Forensics</h1>
        <p className="text-muted-foreground">
          Get AI-driven insights and forecasts for your business. Provide your data below to generate an analysis.
        </p>
      </div>
      <ForensicsForm />
    </div>
  );
}
