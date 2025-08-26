import "./style.css";
import renderer from "./modules/renderer.js";
import { Task, Project, ProjectManager } from "./modules/taskManager.js";
import { parse } from 'date-fns';

const main = (() => {
    let taskForm, createTaskButton;

    const init = () => {
        _cacheDom();
        _handleTaskFormEvents();
        if (ProjectManager.getProjects().length === 0) {
            _addTemplateProject();
        }
        _handleEvents();
    };

    const _cacheDom = () => {
        taskForm = document.querySelector(".to-do-form");
        createTaskButton = document.querySelector("#create-task");
    };

    const _toggleTaskForm = () => {
        if (taskForm.style.display !== "block") {
            taskForm.style.display = "block";
        }
        else {
            taskForm.style.display = "none";
        }
    };

    const _removeTask = (id) => {
        ProjectManager.getActiveProject().removeTask(id);
    };

    const _addTemplateProject = () => {
        const templateProject = new Project("Project 1");
        ProjectManager.addProject(templateProject);
        ProjectManager.setActiveProject(templateProject);
        renderer.renderProjects(ProjectManager.getProjects());
        const task = new Task({
            title: "meow",
            description: "meow meow",
            priority: "high",
            dueDate: "2025/07/05"
        });
        templateProject.addTask(task);
        renderer.renderProject(templateProject);
    };

    const _onTaskDelete = (deleteButton) => {
        const taskId = deleteButton.parentElement.dataset.id;
        _removeTask(taskId);
        renderer.renderProject(ProjectManager.getActiveProject());
        _addDeleteTaskEvent();
    };

    const _getTask = (button) => {
        const taskId = button.parentElement.dataset.id;
        const task = ProjectManager.getActiveProject().getTask(taskId);
        return task;
    }

    const _onTaskChangeState = (stateButton) => {
        const task = _getTask(stateButton);
        task.changeState();
        renderer.renderProject(ProjectManager.getActiveProject());
        _addChangeTaskStateEvent();
    };

    const _addChangeTaskStateEvent = () => {
        const stateButtons = document.querySelectorAll("#state");
        stateButtons.forEach(stateButton => {
            stateButton.addEventListener("click", () => _onTaskChangeState(stateButton));
        });
    };

    const _addDeleteTaskEvent = () => {
        const deleteButtons = document.querySelectorAll("#delete");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener("click", () => _onTaskDelete(deleteButton));
        });
    };

    const _onFormSubmit = (e) => {
        _toggleTaskForm();
        const formData = new FormData(taskForm);
        const dataJSON = Object.fromEntries(formData.entries());
        const activeProject = ProjectManager.getActiveProject();

        const taskId = taskForm.dataset.taskId;
        if (taskId === null) {
            const task = new Task(dataJSON);
            activeProject.addTask(task);
        }
        else {
            activeProject.editTask(taskId, dataJSON);
        }
        renderer.renderProject(activeProject);
        _handleEvents();
        taskForm.reset();
    };

    const _handleEvents = () => {
        _addDeleteTaskEvent();
        _addChangeTaskStateEvent();
        _addEditTaskEvent();
    };

    const _handleTaskFormEvents = () => {
        createTaskButton.addEventListener("click", _toggleTaskForm);
        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            _onFormSubmit(e);
        });
    };

    const _addEditTaskEvent = () => {
        const editButtons = document.querySelectorAll("#edit");
        editButtons.forEach(editButton => {
            editButton.addEventListener("click", () => _onTaskEdit(editButton));
        });
    };

    const _onTaskEdit = (editButton) => {
        _toggleTaskForm();
        const task = _getTask(editButton);
        taskForm.dataset.taskId = task.id;
        for (const p of taskForm.children) {
            if (p.tagName !== "P") return;
            const input = p.children[1];
            input.value = task[input.id].replaceAll("/", "-");
        }
    };

    return { init };
})();

main.init();