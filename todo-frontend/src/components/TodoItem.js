// TodoItem.js
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TodoItem.css";

registerLocale('ru', ru);

const TodoItem = ({ task, setTasks, token, taskListUpdate }) => {
    const taskDate = task.dueDate || new Date()
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    expireDate: new Date(taskDate)
    });

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3010/task/${task._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      taskListUpdate(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3010/task/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      taskListUpdate(true);

      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      category: task.category,
      expireDate: task.dueDate,
    });

    setIsEditing(false);
  };

  const handleInputChange = (value, name) => {
    if(name === 'expireDate') {
      setEditedTask(prev => ({
        ...prev,
        [name]: new Date(value)  
      }));
    } else {
      setEditedTask(prev => ({
        ...prev,  
        [name]: value
      }));
    }
  };

  return (
    <div className='todoitem-container'>
      {isEditing ? (
        <div className='todoitem-edit-container'>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={e => handleInputChange(e.target.value, e.target.name)}
          />
          <label>Описание:</label>
          <input
            type="text"
            name="description"
            value={editedTask.description}
            onChange={e => handleInputChange(e.target.value, e.target.name)}
          />
          <label>Категория:</label>
          <input
            type="text"
            name="category"
            value={editedTask.category}
            onChange={e => handleInputChange(e.target.value, e.target.name)}
          />
          <label>Дата выполнения:</label>
          <DatePicker selected={editedTask.expireDate} onChange={date => handleInputChange(date, 'expireDate')} locale="ru"/><br/>
          <button className="modal-button-regular" onClick={handleUpdate}>Сохранить</button>
          <button className="modal-button-cancel" onClick={handleCancelEdit}>Отмена</button>
        </div>
      ) : (
        <div className='todoitem-regular-container'>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Категория: {task.category}</p>
          <p>{editedTask.expireDate.toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          }).slice(0,10)}</p>
          <button className="button-regular" onClick={handleEdit}>Изменить</button>
          <button className="button-delete" onClick={handleDelete}>Удалить</button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;