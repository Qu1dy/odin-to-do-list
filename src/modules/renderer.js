import projectIcon from "../assets/project.svg";
import optionsIcon from "../assets/hamburger-menu.svg";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";
import expandIcon from "../assets/expand-task.svg";
    import taskDoneIcon from "../assets/checked.svg";
import taskUndoneIcon from "../assets/unchecked.svg";

const renderer = (() => {
    let projectsElement, TasksElement, categoryHeaderElement, activeCategory, taskForm, formButton, expandedTaskDialog;

    const _cacheDom = () => {
        projectsElement = document.querySelector(".projects");
        TasksElement = document.querySelector(".tasks");
        categoryHeaderElement = document.querySelector(".category-name");
        taskForm = document.querySelector(".to-do-form");
        formButton = taskForm.querySelector("button");
        expandedTaskDialog = document.querySelector("#expanded");
    };

    const hideTaskForm = () => {
        taskForm.style.display = "none";
    };

    const renderExpandedTask = (task) => {
        expandedTaskDialog.show();
        
        const divs = expandedTaskDialog.children;
        Array.from(divs).forEach(div => {
            const toChange = div.children[1];
            const className = toChange.classList[0];
            let text = task[className];
            if(className === "priority") {
                text = text.charAt(0).toUpperCase() + text.slice(1); //capitalize
            }
            toChange.textContent = text;
        });
    };

    const closeExpandedTask = () => {
        expandedTaskDialog.close();
    };

    const renderTaskForm = (index = null, task=null) => {
        const _changeButtonText = (newText) => {
            formButton.textContent = newText;
        };
        
        taskForm.style.display = "block";
        if (index === null || task === null) {
            delete taskForm.dataset;
            taskForm.reset();
            _changeButtonText("Add task");
            TasksElement.insertBefore(taskForm, TasksElement.firstChild);
            return;
        }

        const taskToReplace = TasksElement.children[index];
        taskForm.dataset.taskId = task.id;
        _changeButtonText("Apply changes");
        for (const child of Array.from(taskForm.children).filter(child => child.tagName === "P")) {
            const input = child.children[1];
            input.value = task[input.id].replaceAll("/", "-");
        }
        
        TasksElement.replaceChild(taskForm, taskToReplace);
    };

    const _createProjectElement = ({ name, id }) => {
        const projectEL = document.createElement("button");
        projectEL.dataset.id = id;
        projectEL.classList.add("project");

        const iconImg = document.createElement("img");
        iconImg.src = projectIcon;
        iconImg.alt = "Project"
        iconImg.classList.add("icon");

        const optionsImg = document.createElement("img");
        optionsImg.src = optionsIcon;
        optionsImg.alt = "Options";
        optionsImg.classList.add("options");

        projectEL.append(iconImg, name, optionsImg);
        return projectEL;
    };

    const _renderCategoryHeader = (project) => {
        categoryHeaderElement.textContent = project.name;
    };

    const _buttonElement = (imgSrc, alt, id=null) => {
        const buttonEL = document.createElement("button");
        buttonEL.setAttribute("id", id ?? alt.toLowerCase());
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = alt;
        img.classList.add("icon");
        buttonEL.append(img);
        return buttonEL;
    };

    const _createTaskElement = ({ title, priority, dueDate, completed, id }) => {
        const taskEL = document.createElement("li");
        taskEL.dataset.id = id;
        taskEL.classList.add("task");
        taskEL.classList.add(priority);

        const taskStatus = completed ? _buttonElement(taskDoneIcon, "Done", "state") : _buttonElement(taskUndoneIcon, "Undone", "state");

        const titleEL = document.createElement("h3");
        titleEL.textContent = title;
        if (completed) {
            titleEL.classList.add("strikethrough");
        }

        const editButtonEL = _buttonElement(editIcon, "Edit");
        const deleteButtonEL = _buttonElement(deleteIcon, "Delete");
        const dateEL = document.createElement("h4");
        dateEL.textContent = dueDate.replaceAll("-", "/");

        const expandButtonEL = _buttonElement(expandIcon, "Expand")

        taskEL.append(taskStatus, titleEL, editButtonEL, deleteButtonEL, dateEL, expandButtonEL);
        return taskEL;
    };

    const renderProjects = (projects) => {
        projects.forEach(project => {
            _renderProjectInSidebar(project);
        });
    };

    const _renderProjectInSidebar = (project) => {
        const projectEL = _createProjectElement(project);
        projectsElement.append(projectEL);
    };

    const renderProject = (project) => {
        _renderCategoryHeader(project);
        _renderProjectTasks(project);
    };

    const _renderProjectTasks = (project) => {
        const projectElement = Array.from(projectsElement.children).find(projectEL => projectEL.dataset.id === project.id);
        if (activeCategory) {
            activeCategory.classList.toggle("active");
        }
        activeCategory = projectElement;
        activeCategory.classList.toggle("active");

        TasksElement.innerHTML = "";
        project.getTasks().forEach(task => {
            _renderTask(task);
        });
    };

    const _renderTask = (task) => {
        const taskEL = _createTaskElement(task);
        TasksElement.append(taskEL);
    };

    _cacheDom();

    return { renderProjects, closeExpandedTask ,renderProject, renderTaskForm, hideTaskForm, renderExpandedTask};
})();

export default renderer;