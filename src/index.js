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
    }

    const _addTemplateProject = () => {
        const templateProject = new Project("Project 1");
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

    const _onKeyDown = (e) => {
        if (e.key !== "Escape") return;

        if (expandedTaskDialog.open) {
            renderer.closeExpandedTask();
            return;
        }

        if (taskForm.style.display === "block") {
            _renderWithEvents();
            return;
        }
        if(projectForm.style.display === "flex") {
            renderer.hideProjectForm();
        }
    }

    const _handleKeyPresses = () => {
        closeDialogButton.addEventListener("click", renderer.closeExpandedTask);
        document.addEventListener("keydown", (e) => _onKeyDown(e));
    };

    const _getTask = (button) => {
        const taskId = button.parentElement.dataset.id;
        const task = ProjectManager.getActiveProject().getTask(taskId);
        return task;
    };

    const _onTaskChangeState = (stateButton) => {
        const task = _getTask(stateButton);
        task.changeState();
    };

    const _addEvent = (buttonsId, func, renderAfter = true) => {
        const buttons = document.querySelectorAll(`#${buttonsId}`);
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                func(button);
                if (!renderAfter) return;
                _renderWithEvents();
            });
        });
    };

    const _onTaskFormSubmit = () => {
        renderer.hideTaskForm();
        const formData = new FormData(taskForm);
        const dataJSON = Object.fromEntries(formData.entries());
        const activeProject = ProjectManager.getActiveProject();
        const taskId = taskForm.dataset.id;
        if (taskId) {
            activeProject.editTask(taskId, dataJSON);
        }
        else {
            const task = new Task(dataJSON);
            activeProject.addTask(task);
        }
        taskForm.reset();
    };

    const _handleEvents = () => {
        _addEvent("delete", _onTaskDelete);
        _addEvent("state", _onTaskChangeState);
        _addEvent("edit", _onTaskEdit, false);
        _addEvent("expand", _onTaskExpand, false);
    };

    const _onTaskExpand = (expandButton) => {
        const task = _getTask(expandButton);
        renderer.renderExpandedTask(task);
    };

    const _onProjectFormSubmit = () => {
        renderer.hideProjectForm();
        const formData = new FormData(projectForm);
        const projectName = formData.get("name");
        new Project(projectName);
        renderer.renderProjects(ProjectManager.getProjects());
    };

    const _handleForm = (button, renderFormEvent, form, onSubmitEvent) => {
        button.addEventListener("click", () => {
            delete taskForm.datasetl;
            renderFormEvent();
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            onSubmitEvent();
            _renderWithEvents();
        });
    }

    const _handleProjectFormEvents = () => {
        _handleForm(createProjectButton, renderer.renderProjectForm, projectForm, _onProjectFormSubmit);
    };

    const _handleTaskFormEvents = () => {
        _handleForm(createTaskButton, renderer.renderTaskForm, taskForm, _onTaskFormSubmit);
    };

    const _onTaskEdit = (editButton) => {
        const task = _getTask(editButton);
        const index = ProjectManager.getActiveProject().getTasks().indexOf(task);
        renderer.renderTaskForm(index, task);
    };

    return { init };
})();

main.init();