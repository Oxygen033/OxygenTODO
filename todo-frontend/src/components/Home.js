import { useContext, useEffect, useState, useRef} from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/Home.css";
import TodoItem from "./TodoItem";
import ReactModal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

function Home()
{
    const {Logout, currentUsername, token} = useContext(AuthContext);

    const [tasksList, setTasksList] = useState([]);
    const [tasksListUpdated, setTasksListUpdated] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    //Переменные для модальных окон
    ReactModal.setAppElement("#root");
    const [modals, setModals] = useState({
        CreateTaskModal: false,
        DeleteTaskModal: false,
        EditTaskModal: false
    });
    const [modalsFields, setModalsFields] = useState({
        newTaskName: null,
        newTaskDesc: null,
        newTaskCategory: null,
        newTaskExpDate: new Date()
    });
    const [newTaskName, setNewTaskName] = useState();
    const CreateTaskRef = useRef();

    async function GetTasks()
    {
        let response = await fetch(`http://localhost:3010/tasks/${currentUsername}`, {
            method: "GET",
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        response = await response.json();
        return response;
    }

    useEffect(() => {
        GetTasks().then(resp => {
            //setGroupsIdsList(Array.from(resp[1]));
            console.log(Array.from(resp));
            setTasksList(Array.from(resp).map((task) => <TodoItem key={task.id} task={task} setTasks={setTasksList} token={token} taskListUpdate={(state) => setTasksListUpdated(state)}/>));
        });
        setTasksListUpdated(false);
    }, [tasksListUpdated]);

    async function handleTaskCreate(title, desc, category, expdate)
    {
        try
        {
        if (!modalsFields.newTaskName) {
            alert('Введите название задачи!');
            throw new Error("Name not defined");
        }
        const response = await fetch('http://localhost:3010/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                title: title,
                description: desc,
                category: category,
                dueDate: expdate
            })
        });
        if(response.ok)
        {
            setTasksListUpdated(true);
            console.log("Created");
        }
        setModalsFields({newTaskName: null, newTaskDesc: null, newTaskCategory: null, newTaskExpDate: new Date()});
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    function handleEditClick(id)
    {
        setEditingTask(id);
    }

    function handleSaveClick(editedTask)
    {
        setTasksList((prevTasks) => prevTasks.map((task) => task.id === editedTask.id ? editedTask : task));
        setEditingTask(null);
    }

    async function handleTaskDelete(id)
    {
        console.log(`HandleTaskDelete called with id ${id}`);
        const response = await fetch(`http://localhost:3010/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        if(response.ok)
        {
            setTasksListUpdated(true);
            console.log("Deleted");
        }
    }

    return(
        <div className="home-container">
            <ReactModal
                isOpen = {modals.CreateTaskModal}
                onAfterOpen = {() => {}}
                onRequestClose={() => setModals({...modals, CreateTaskModal:false})}
                contentLabel="Новая задача"
                style = {{
                    content: {
                        top: "30%",
                        left: "40%",
                        right: "40%",
                        bottom: "30%"
                    }
                }}
            >
                <p style={{textAlign:'center'}}>Добавить задачу</p>
                <label>Название:</label>
                <input type="text" placeholder="Название" onChange={e => setModalsFields({...modalsFields, newTaskName: e.target.value})}/>
                <label>Описание:</label>
                <input type="text" placeholder="Описание" onChange={e => setModalsFields({...modalsFields, newTaskDesc: e.target.value})}/>
                <label>Категория:</label>
                <input type="text" placeholder="Категория" onChange={e => setModalsFields({...modalsFields, newTaskCategory: e.target.value})}/>
                <label>Дата выполнения:</label>
                <DatePicker selected={modalsFields.newTaskExpDate} onChange={(date) => setModalsFields({...modalsFields, newTaskExpDate: date})} showIcon locale="ru"/><br/>
                <button  className="modal-button-regular" onClick={() => {
                    if(handleTaskCreate(modalsFields.newTaskName, modalsFields.newTaskDesc, modalsFields.newTaskCategory, modalsFields.newTaskExpDate))
                    { 
                        setModals({...modals, CreateTaskModal:false});
                    }
                    }}>Добавить</button>
                <button  className="modal-button-cancel" onClick={() => setModals({...modals, CreateTaskModal:false})}>Отмена</button>
            </ReactModal>
            <nav>
                <div class="navbar">
                    <div class="nav-title">OxygenTODO</div>
                    <div class="nav-message">Добро пожаловать, {currentUsername}</div>
                    <button class="nav-logout" onClick={() => Logout()}>Выйти</button>
                </div>
            </nav>
            <div class="todo-container">
                <div class="todo-list">
                    {tasksList}
                </div>
                <div class="add-todo-btn" onClick={() => setModals({...modals, CreateTaskModal: true})}>Добавить задачу</div>
            </div>
        </div>
    );
}

export default Home;