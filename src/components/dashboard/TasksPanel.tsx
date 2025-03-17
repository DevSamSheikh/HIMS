import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRightCircle,
  UserPlus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  module: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignedTo?: string;
}

interface TasksPanelProps {
  tasks?: Task[];
  onCompleteTask?: (taskId: string) => void;
  onReassignTask?: (taskId: string) => void;
}

const TasksPanel = ({
  tasks = [
    {
      id: "1",
      title: "Review patient intake forms",
      module: "Patient Management",
      priority: "high",
      dueDate: "2023-06-15",
    },
    {
      id: "2",
      title: "Update billing information",
      module: "Billing",
      priority: "medium",
      dueDate: "2023-06-18",
    },
    {
      id: "3",
      title: "Schedule follow-up appointments",
      module: "Appointments",
      priority: "low",
      dueDate: "2023-06-20",
    },
    {
      id: "4",
      title: "Complete medical records",
      module: "Patient Management",
      priority: "high",
      dueDate: "2023-06-16",
    },
    {
      id: "5",
      title: "Process insurance claims",
      module: "Billing",
      priority: "medium",
      dueDate: "2023-06-19",
    },
  ],
  onCompleteTask = () => {},
  onReassignTask = () => {},
}: TasksPanelProps) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="ml-2">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="ml-2">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="ml-2">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getModuleBadge = (module: string) => {
    switch (module) {
      case "Patient Management":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 ml-2">{module}</Badge>
        );
      case "Billing":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 ml-2">
            {module}
          </Badge>
        );
      case "Appointments":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 ml-2">
            {module}
          </Badge>
        );
      case "Administrative Tasks":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 ml-2">
            {module}
          </Badge>
        );
      default:
        return <Badge className="ml-2">{module}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const highPriorityTasks = tasks.filter((task) => task.priority === "high");
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium",
  );
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low");

  const patientManagementTasks = tasks.filter(
    (task) => task.module === "Patient Management",
  );
  const billingTasks = tasks.filter((task) => task.module === "Billing");
  const appointmentsTasks = tasks.filter(
    (task) => task.module === "Appointments",
  );
  const administrativeTasks = tasks.filter(
    (task) => task.module === "Administrative Tasks",
  );

  const renderTaskItem = (task: Task) => (
    <div
      key={task.id}
      className="flex items-center justify-between p-4 border-b last:border-0"
    >
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium">{task.title}</span>
          {getPriorityBadge(task.priority)}
          {getModuleBadge(task.module)}
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Due: {formatDate(task.dueDate)}</span>
          {task.assignedTo && (
            <span className="ml-4">Assigned to: {task.assignedTo}</span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center"
          onClick={() => onReassignTask(task.id)}
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Reassign
        </Button>
        <Button
          size="sm"
          className="flex items-center"
          onClick={() => onCompleteTask(task.id)}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Complete
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full bg-card overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <Tabs defaultValue="priority">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="priority">By Priority</TabsTrigger>
              <TabsTrigger value="module">By Module</TabsTrigger>
            </TabsList>

            <TabsContent value="priority" className="space-y-4">
              {highPriorityTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                    High Priority
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {highPriorityTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}

              {mediumPriorityTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-1 text-amber-500" />
                    Medium Priority
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {mediumPriorityTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}

              {lowPriorityTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <ArrowRightCircle className="w-4 h-4 mr-1 text-blue-500" />
                    Low Priority
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {lowPriorityTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="module" className="space-y-4">
              {patientManagementTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    Patient Management
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {patientManagementTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}

              {billingTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    Billing
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {billingTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}

              {appointmentsTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    Appointments
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {appointmentsTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}

              {administrativeTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                    Administrative Tasks
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                    {administrativeTasks.map(renderTaskItem)}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
