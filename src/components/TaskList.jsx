import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const TaskList = ({ tasks, onTaskComplete }) => {
  return (
    <Card>
      <CardContent className="p-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onTaskComplete(task.id)}
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.title}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskList;