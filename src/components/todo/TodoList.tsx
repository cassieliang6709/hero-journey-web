
import React from 'react';
import TodoItem from './TodoItem';
import { TodoItem as TodoItemType } from '@/hooks/useTodos';

interface TodoListProps {
  todos: TodoItemType[];
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
