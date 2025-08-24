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

    const _addDeleteTaskEvent = () => {
        const deleteButton = document.querySelector(".task:last-child #delete");
        deleteButton.addEventListener("click", () => {
            const taskId = deleteButton.parentElement.dataset.id;
            _removeTask(taskId);
            renderer.renderProject(ProjectManager.getActiveProject());
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