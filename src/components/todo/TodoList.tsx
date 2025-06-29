
import React from 'react';
import TodoItem from './TodoItem';

export interface TodoItemType {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  progress?: {
    completed: number;
    total: number;
  };
}

interface TodoListProps {
  todos: TodoItemType[];
  onToggleTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleTodo }) => {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          category={todo.category}
          progress={todo.progress}
          onToggle={onToggleTodo}
        />
      ))}
      {todos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>还没有待办事项</p>
          <p className="text-sm mt-1">在聊天界面添加新任务吧！</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
