import projectIcon from "../assets/project.svg";
import optionsIcon from "../assets/hamburger-menu.svg";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";
import expandIcon from "../assets/expand-task.svg";
import shrinkIcon from "../assets/shrink-task.svg";
import taskDoneIcon from "../assets/checked.svg";
import taskUndoneIcon from "../assets/unchecked.svg";

const renderer = (() => {
    let projectsElement, TasksElement, categoryHeaderElement, activeCategory;

    const _cacheDom = () => {
        projectsElement = document.querySelector(".projects");
        TasksElement = document.querySelector(".tasks");
        categoryHeaderElement = document.querySelector(".category-name");
    }

    const _createProjectElement = ({name, id}) => {
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
    }

    const _renderCategoryHeader = (project) => {
        categoryHeaderElement.textContent = project.name; 
    }

    const _buttonElement = (imgSrc, alt = null) => {
        const buttonEL = document.createElement("button");

        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = alt;
        img.classList.add("icon");
        buttonEL.append(img);
        return buttonEL;
    }

    const _createTaskElement = ({ title, priority, dueDate, completed, id}) => {
        const taskEL = document.createElement("li");
        taskEL.dataset.id = id;
        taskEL.classList.add("task");
        taskEL.classList.add(priority);

        const taskStatus = completed ? _buttonElement(taskDoneIcon, "Done") : _buttonElement(taskUndoneIcon, "Undone");
        taskStatus.setAttribute("id", "state");

        const titleEL = document.createElement("h3");
        titleEL.textContent = title;
        if(completed) {
            titleEL.classList.add("strikethrough");
        }

        const editButtonEL = _buttonElement(editIcon, "Edit");
        editButtonEL.setAttribute("id", "edit");
        const deleteButtonEL = _buttonElement(deleteIcon, "Delete");
        deleteButtonEL.setAttribute("id", "delete");
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
    }

    const _renderProjectTasks = (project) => {
        const projectElement = Array.from(projectsElement.children).find(projectEL => projectEL.dataset.id === project.id);
        if(activeCategory) {
            activeCategory.classList.toggle("active");
        }
        activeCategory = projectElement;
        activeCategory.classList.toggle("active");
        
        TasksElement.innerHTML = "";
        project.tasks.forEach(task => {
            _renderTask(task);
        });
    }

    const _renderTask = (task) => {
        const taskEL = _createTaskElement(task);
        TasksElement.append(taskEL);
    };

    _cacheDom();

    return { renderProjects, renderProject};
})();

export default renderer;