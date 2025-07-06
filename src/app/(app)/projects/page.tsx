import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const projects = [
  {
    title: "Website Redesign",
    description: "Complete overhaul of the public-facing website.",
    status: "In Progress",
    progress: 60,
    variant: "default",
  },
  {
    title: "Mobile App Launch",
    description: "New native mobile application for iOS and Android.",
    status: "Planning",
    progress: 15,
    variant: "secondary",
  },
  {
    title: "Q2 Marketing Campaign",
    description: "Social media and email campaigns for new product features.",
    status: "In Progress",
    progress: 80,
    variant: "default",
  },
  {
    title: "API Integration",
    description: "Connecting to third-party logistics provider.",
    status: "Completed",
    progress: 100,
    variant: "outline",
  },
];

const clientTasks = [
  { id: "task1", label: "Provide brand assets for new website", done: true },
  { id: "task2", label: "Approve final mobile app mockups", done: false },
  { id: "task3", label: "Review Q2 marketing copy", done: false },
  { id: "task4", label: "Sign off on the API integration documents", done: true },
];

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What We're Working On</h2>
          {projects.map((project) => (
            <Card key={project.title} className="transform transition-all hover:scale-102 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{project.title}</CardTitle>
                  <Badge variant={project.variant as any}>{project.status}</Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={project.progress} className="w-full" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {project.progress}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your To-Do List</h2>
          <Card className="transform transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {clientTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 rounded-md p-3 transition-colors hover:bg-muted/50">
                    <Checkbox id={task.id} checked={task.done} />
                    <Label
                      htmlFor={task.id}
                      className={`flex-1 text-sm ${
                        task.done ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {task.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
