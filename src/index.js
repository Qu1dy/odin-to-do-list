import "./style.css";
import renderer from "./modules/renderer.js";
import { Task, Project, ProjectManager } from "./modules/taskManager.js";

const main = (() => {
    let createTaskButton, taskForm, closeDialogButton, expandedTaskDialog, projectForm, createProjectButton;

    const init = () => {
        _cacheDom();
        _handleTaskFormEvents();
        _handleProjectFormEvents();
        _handleKeyPresses();
        if (ProjectManager.getProjects().length === 0) {
            _addTemplateProject();
        }
        _renderWithEvents();
    };

    const _cacheDom = () => {
        createTaskButton = document.querySelector("#create-task");
        createProjectButton = document.querySelector("#create-project")
        closeDialogButton = document.querySelector("#close");
        taskForm = document.querySelector(".to-do-form");
        expandedTaskDialog = document.querySelector("#expanded");
        projectForm = document.querySelector("#project-form");
    };

    const _removeTask = (id) => {
        ProjectManager.getActiveProject().removeTask(id);
    };

    const _renderWithEvents = () => {
        renderer.renderProjects(ProjectManager.getProjects());
        _handleEvents();
    };

    const _addTemplateProject = () => {
        const templateProject = new Project("Project 1");
        ProjectManager.setActiveProject(templateProject.id);
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

    const _onKeyDown = (e) => {
        if (e.key !== "Escape") return;

        if (expandedTaskDialog.open) {
            renderer.closeExpandedTask();
            return;
        }

        if (taskForm.style.display !== "none" || projectForm.style.display !== "none") {
            _renderWithEvents();
            return;
        }
        if (projectForm.style.display === "flex") {
            renderer.hideProjectForm();
        }
    };

    const _handleKeyPresses = () => {
        closeDialogButton.addEventListener("click", renderer.closeExpandedTask);
        document.addEventListener("keydown", (e) => _onKeyDown(e));
    };

    const _getTask = (button) => {
        const taskId = button.parentElement.dataset.id;
        const task = ProjectManager.getActiveProject().getTaskById(taskId);
        return task;
    };

    const _getProject = (button) => {
        const projectId = button.parentElement.dataset.id;
        const project = ProjectManager.getProjectById(projectId);
        return project;
    };

    const _onTaskChangeState = (stateButton) => {
        const task = _getTask(stateButton);
        task.changeState();
    };

    const _addEvent = (buttonsSelector, func, renderAfter = true) => {
        const buttons = document.querySelectorAll(buttonsSelector);
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                func(button);
                if (!renderAfter) return;
                console.log("meow");
                _renderWithEvents();
            });
        });
    };

    const _onTaskFormSubmit = () => {
        const [data, taskId] = _onFormSubmit(taskForm, renderer.hideTaskForm);
        const activeProject = ProjectManager.getActiveProject();
        if (taskId) {
            activeProject.editTask(taskId, data);
        }
        else {
            const task = new Task(data);
            activeProject.addTask(task);
        }
    };

    const _handleEvents = () => {
        _addEvent(".task .delete", _onTaskDelete);
        _addEvent(".task .state", _onTaskChangeState);
        _addEvent(".task .edit", _onTaskEdit, false);
        _addEvent(".task .expand", _onTaskExpand, false);
        _addEvent(".project", _onProjectSelect);
        _addEvent(".project .edit", _onProjectEdit, false);
    };

    const _onProjectSelect = (projectButton) => {
        const projectId = projectButton.dataset.id;
        ProjectManager.setActiveProject(projectId);
    };

    const _onTaskExpand = (expandButton) => {
        const task = _getTask(expandButton);
        renderer.renderExpandedTask(task);
    };

    const _onFormSubmit = (form, hideForm) => {
        hideForm();
        const formData = new FormData(form);
        const dataJSON = Object.fromEntries(formData.entries());
        const id = form.dataset.id;
        return [dataJSON, id];
    };

    const _onProjectFormSubmit = () => {
        const [data, projectId] = _onFormSubmit(projectForm, renderer.hideProjectForm);
        const name = data.name;
        if(!projectId) {
            new Project(name);
        }
        else {
            ProjectManager.editProject(projectId, name);
        }
        renderer.renderProjects(ProjectManager.getProjects());
    };

    const _handleForm = (button, renderFormEvent, form, onSubmitEvent) => {
        button.addEventListener("click", () => {
            delete form.dataset;
            renderFormEvent();
            form.reset();
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            onSubmitEvent();
            _renderWithEvents();
        });
    };

    const _handleProjectFormEvents = () => {
        _handleForm(createProjectButton, renderer.renderProjectForm, projectForm, _onProjectFormSubmit);
    };

    const _handleTaskFormEvents = () => {
        _handleForm(createTaskButton, renderer.renderTaskForm, taskForm, _onTaskFormSubmit);
    };

    const _onTaskEdit = (editButton) => {
        const task = _getTask(editButton);
        const tasks = ProjectManager.getActiveProject().getTasks();
        const index = tasks.indexOf(task);
        renderer.renderTaskForm(index, task);
    };

    const _onProjectEdit = (editButton) => {
        const project = _getProject(editButton);
        const projects = ProjectManager.getProjects();
        const index = projects.indexOf(project);
        renderer.renderProjectForm(index, project);
    };

    return { init };
})();

main.init();