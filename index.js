'use strict';


class Todo {
constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
        
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]))
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
        
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>`);

        if(todo.completed) {
            this.todoCompleted.append(li)
        } else {
            this.todoList.append(li)
        }
         
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('пустое поле добавить нельзя')
        }  
       
           
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(keyNumber) {
       // найти по ключу элемент и удалить из нью мап и сделать рендер
         const allAddItems = document.querySelectorAll('.todo-item');
        allAddItems.forEach((item) => {
             if (item.key === keyNumber) {
                this.todoData.delete(item.key);
                item.parentNode.removeChild(item);
                this.addToStorage();
            }
       })


    }
    

    completedItem(keyNumber) {
      const item = this.todoData.get(keyNumber);
        console.log(item);
        item.completed = !item.completed;
        this.render();
    }

    hadler() { 
        const todoContainer = document.querySelector('.todo-container');
        todoContainer.addEventListener('click', (elem) => {

            const todoComleteBtn = document.querySelectorAll('.todo-complete');
            const todoDeleteBtn = document.querySelectorAll('.todo-remove');
            let target = elem.target;
            todoComleteBtn.forEach((item) => {
                let key = item.parentElement.parentElement.key;
                
                if (target === item) {
                    this.completedItem(key)
                }
            });
            todoDeleteBtn.forEach((item) => {
                let key = item.parentElement.parentElement.key;
                
                if (target === item) {
                    this.deleteItem(key)
                }
            })
            
        })
        
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.hadler();
        
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();