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
        _handleEvents();
    };

    const _cacheDom = () => {
        createTaskButton = document.querySelector("#create-task");
        taskForm = document.querySelector(".to-do-form");
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
        createTaskButton.addEventListener("click", () => renderer.renderTaskForm());

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
        const task = _getTask(editButton);
        const index = ProjectManager.getActiveProject().getTasks().indexOf(task);
        renderer.renderTaskForm(index);
        taskForm.dataset.taskId = task.id;
        for (const child of taskForm.children) {
            if (child.tagName !== "P") {
                child.textContent = "Apply changes";
                return;
            };
            const input = child.children[1];
            input.value = task[input.id].replaceAll("/", "-");
        }
    };

    return { init };
})();

main.init();