import "./style.css";
import renderer from "./modules/renderer.js";
import { Task, Project, ProjectManager } from "./modules/taskManager.js";

const main = (() => {
    let taskForm, createTaskButton;

    const init = () => {
        _cacheDom();
        _handleTaskFormEvents();
        if (ProjectManager.getProjects().length === 0) {
            _addTemplateProject();
        }
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
        renderer.renderProject(templateProject);
    };

    const _onTaskDelete = (deleteButton) => {
        const taskId = deleteButton.parentElement.dataset.id;
        _removeTask(taskId);
        renderer.renderProject(ProjectManager.getActiveProject());
        _addDeleteTaskEvent();
    };

    const _onTaskChangeState = (stateButton) => {
        const taskId = stateButton.parentElement.dataset.id;
        const task = ProjectManager.getActiveProject().getTask(taskId);
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
        const task = new Task(dataJSON);
        const activeProject = ProjectManager.getActiveProject();
        activeProject.addTask(task);
        renderer.renderProject(activeProject);
        _addDeleteTaskEvent();
        _addChangeTaskStateEvent();
        taskForm.reset();
    };

    const _handleTaskFormEvents = () => {
        createTaskButton.addEventListener("click", _toggleTaskForm);
        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();
            _onFormSubmit(e);
        });
    };

    return { init };
})();

main.init();