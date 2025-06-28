
import React from 'react';
import TodoItem from './TodoItem';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  progress?: {
    completed: number;
    total: number;
  };
}

interface TodoListProps {
  todos: TodoItem[];
  onToggleTodo: (id: number) => void;
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
    </div>
  );
};

export default TodoList;
