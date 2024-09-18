import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from "@/components/ui/card";

const TaskKanban = ({ tasks, onTaskUpdated }) => {
  const columns = {
    'To-Do': tasks.filter(task => task.status === 'To-Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed'),
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const task = tasks.find(t => t.id.toString() === result.draggableId);

    if (source.droppableId !== destination.droppableId) {
      onTaskUpdated(task.id, { status: destination.droppableId });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="flex-1">
            <h3 className="font-semibold mb-2">{columnId}</h3>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-2 rounded min-h-[200px]"
                >
                  {columnTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2"
                        >
                          <CardContent className="p-2">
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskKanban;
