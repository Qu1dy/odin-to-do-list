import "./style.css";
import renderer from "./modules/renderer.js";
import { Task, Project, ProjectManager } from "./modules/taskManager.js";

const main = (() => {
    let createTaskButton, taskForm;

    const init = () => {
        _cacheDom();
        _handleTaskFormEvents();
        if (ProjectManager.getProjects().length === 0) {
            _addTemplateProject();
        }
        _renderWithEvents();
    };

    const _cacheDom = () => {
        createTaskButton = document.querySelector("#create-task");
        taskForm = document.querySelector(".to-do-form");
    };

    const _removeTask = (id) => {
        ProjectManager.getActiveProject().removeTask(id);
    };

    const _renderWithEvents = () => {
        renderer.renderProject(ProjectManager.getActiveProject());
        _handleEvents();
    }

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
    };

    const _onTaskDelete = (deleteButton) => {
        const taskId = deleteButton.parentElement.dataset.id;
        _removeTask(taskId);
    };

    const _getTask = (button) => {
        const taskId = button.parentElement.dataset.id;
        const task = ProjectManager.getActiveProject().getTask(taskId);
        return task;
    }

    const _onTaskChangeState = (stateButton) => {
        const task = _getTask(stateButton);
        task.changeState();
    };

    const _addEvent = (buttonsId, func, renderAfter=true) => {
        const buttons = document.querySelectorAll(`#${buttonsId}`);
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                func(button);
                if(!renderAfter) return;
                _renderWithEvents();
            });
        });
    };

    const _onFormSubmit = (e) => {
        renderer.hideTaskForm();
        const formData = new FormData(taskForm);
        const dataJSON = Object.fromEntries(formData.entries());
        const activeProject = ProjectManager.getActiveProject();
        const taskId = taskForm.dataset.taskId;
        if (taskId) {
            activeProject.editTask(taskId, dataJSON);
        }
        else {
            const task = new Task(dataJSON);
            activeProject.addTask(task);
        }
        taskForm.reset();
        _renderWithEvents();
    };

    const _handleEvents = () => {
        _addEvent("delete", _onTaskDelete);
        _addEvent("state", _onTaskChangeState);
        _addEvent("edit", _onTaskEdit, false);
    };

    const _handleTaskFormEvents = () => {
        createTaskButton.addEventListener("click", () => renderer.renderTaskForm());

        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            _onFormSubmit(e);
        });
    };

    const _onTaskEdit = (editButton) => {
        const task = _getTask(editButton);
        const index = ProjectManager.getActiveProject().getTasks().indexOf(task);
        renderer.renderTaskForm(index, task);
    };

    return { init };
})();

main.init();