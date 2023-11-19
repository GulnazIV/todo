
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector("#tasksList")
const emptyList = document.querySelector('#emptyList')

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)


function addTask(event){
        //отмена отправки формы
        event.preventDefault(); 

        // Достаем текст задачи из поля ввода
        const taskText = taskInput.value;

        // Описываем задачу в виде обьекта
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        }
        tasks.push(newTask)
        
        // Сохраняем задачи в хранилище LocalStorage
        saveToLocalStorage()

        renderTask(newTask);
    
        taskInput.value = ""
        taskInput.focus()

        checkEmptyList()
    
}

function deleteTask(event){
    if (event.target.dataset.action !== 'delete'){
        return 
    }

    const parenNote = event.target.closest('li');
    let id = Number(parenNote.id)

    // Находим индекс задачи в массиве
    // const index = tasks.findIndex((task) => task.id === id);
    // Удаляем задачу из массива с задачами
    // tasks.splice(index, 1)

    // Удаляем задачу из массива через фильтрацию
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем задачи в хранилище LocalStorage
    saveToLocalStorage()

    // Удаляем задачу из разметки
    parenNote.remove()

    checkEmptyList()

}

function doneTask(event){
    if (event.target.dataset.action !== 'done') return;

    const parenNote = event.target.closest('li');   

    // Опеределяем id задачи
    const id = Number(parenNote.id)
    const task = tasks.find( task => task.id === id )
    task.done = !task.done

    // Сохраняем задачи в хранилище LocalStorage
    saveToLocalStorage()

    const taskTitle = parenNote.querySelector('.task-title')  
    taskTitle.classList.toggle('task-title--done')
    
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML =`<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0 ) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // формирование CSS класса
    const cssClass = task.done ? "task-title task-title--done" : 'task-title'
    
    // Формируем разметку на стрнаицу
    const taskHTML = `
                    <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;
    
    // Добавление задачи на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}