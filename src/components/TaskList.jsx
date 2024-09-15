import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TaskList = ({ tasks, onTaskUpdated }) => {
  const handleStatusChange = (taskId, newStatus) => {
    onTaskUpdated(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
              <p className="text-sm">Assignee: {task.assignee_role}</p>
              <p className="text-sm">Priority: {task.priority}</p>
            </div>
            <Select
              value={task.status}
              onValueChange={(value) => handleStatusChange(task.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To-Do">To-Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};