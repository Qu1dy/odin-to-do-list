import "./style.css";
import renderer from "./modules/renderer.js";
import { Task, Project, ProjectManager } from "./modules/taskManager.js";
import { format } from "date-fns";
import storage from "./modules/localStorage.js";

const eventHandler = (() => {
    let createTaskButton, showOnlyCompleted, taskForm,
        closeDialogButton, expandedTaskDialog,
        projectForm, createProjectButton, showAllTasks,
        showOnlyDueThisWeek, datePicker;

    const init = () => {
        _cacheDom();
        datePicker.min = format(new Date(), "yyyy-MM-dd");
        _handleKeyPresses();
        _handleFormEvents();
        _handleCategoryEvents();
        _loadDataFromStorage();
        if (ProjectManager.getProjects().length === 0) {
            _addTemplateProject();
        }
        _renderWithEvents();
    };

    const _loadDataFromStorage = () => {
        const data = storage.getData();
        if (!data) return;

        for (const projectData of data) {
            const project = new Project(projectData.name, projectData.id);
            if(ProjectManager.getProjects().length === 1) {
                ProjectManager.setActiveProject(project.id);
            }

            for(const taskData of projectData.tasks) {
                const task = new Task(taskData);
                project.addTask(task);
            }
        }
    };

    const _cacheDom = () => {
        createTaskButton = document.querySelector("#create-task");
        createProjectButton = document.querySelector("#create-project")
        showAllTasks = document.querySelector("#all-tasks");
        showOnlyCompleted = document.querySelector("#completed-tasks");
        showOnlyDueThisWeek = document.querySelector("#due-this-week");
        closeDialogButton = document.querySelector("#close");
        taskForm = document.querySelector(".to-do-form");
        expandedTaskDialog = document.querySelector("#expanded");
        projectForm = document.querySelector("#project-form");
        datePicker = document.querySelector("#dueDate");
    };

    const _renderWithEvents = () => {
        const projects = ProjectManager.getProjects();
        renderer.showProjects(projects);
        _handleEvents();
        storage.saveData(projects);
    };

    const _addTemplateProject = () => {
        const templateProject = new Project("Project 1");
        ProjectManager.setActiveProject(templateProject.id);
        renderer.showProjects(ProjectManager.getProjects());
    };

    const _onTaskDelete = (deleteButton) => {
        const taskId = deleteButton.parentElement.dataset.id;
        ProjectManager.getActiveProject().removeTask(taskId);
    };

    const _deleteProject = (deleteButton) => {
        const projectId = deleteButton.parentElement.dataset.id;
        ProjectManager.removeProject(projectId);
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
        _handleTaskEvents();
        _handleProjectEvents();
    };

    const _handleTaskEvents = () => {
        _addEvent(".task .delete", _onTaskDelete);
        _addEvent(".task .state", _onTaskChangeState);
        _addEvent(".task .edit", _onTaskEdit, false);
        _addEvent(".task .expand", _onTaskExpand, false);
    };

    const _handleProjectEvents = () => {
        _addEvent(".project", _onProjectSelect);
        _addEvent(".project .edit", _onProjectEdit, false);
        _addEvent(".project .delete", _deleteProject);
    };

    const _onProjectSelect = (projectButton) => {
        const projectId = projectButton.dataset.id;
        ProjectManager.setActiveProject(projectId);
    };

    const _onTaskExpand = (expandButton) => {
        const task = _getTask(expandButton);
        renderer.expandTask(task);
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
        if (!projectId) {
            new Project(name);
        }
        else {
            ProjectManager.editProject(projectId, name);
        }
        renderer.showProjects(ProjectManager.getProjects());
    };

    const _handleForm = (button, renderFormEvent, form, onSubmitEvent) => {
        button.addEventListener("click", () => {
            delete form.dataset.id;
            renderFormEvent();
            form.reset();
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            onSubmitEvent();
            _renderWithEvents();
        });
    };

    const _handleCategoryEvent = (button, tasks) => {
        button.addEventListener("click", () => {
            ProjectManager.clearActiveProject();
            renderer.showCategory(button, tasks(), ProjectManager.getProjects());
            _handleProjectEvents();
        });
    };

    const _handleCategoryEvents = () => {
        _handleCategoryEvent(showAllTasks, ProjectManager.getAllTasks);
        _handleCategoryEvent(showOnlyCompleted, ProjectManager.getCompletedTasks);
        _handleCategoryEvent(showOnlyDueThisWeek, ProjectManager.getTasksDueThisWeek);
    };

    const _handleFormEvents = () => {
        _handleForm(createTaskButton, renderer.showTaskForm, taskForm, _onTaskFormSubmit);
        _handleForm(createProjectButton, renderer.showProjectForm, projectForm, _onProjectFormSubmit);
    };

    const _onTaskEdit = (editButton) => {
        const task = _getTask(editButton);
        const tasks = ProjectManager.getActiveProject().getTasks();
        const index = tasks.indexOf(task);
        renderer.showTaskForm(index, task);
    };

    const _onProjectEdit = (editButton) => {
        const project = _getProject(editButton);
        const projects = ProjectManager.getProjects();
        const index = projects.indexOf(project);
        renderer.showProjectForm(index, project);
    };

    return { init };
})();

eventHandler.init();