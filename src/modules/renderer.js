import projectIcon from "../assets/project.svg";
import optionsIcon from "../assets/hamburger-menu.svg";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";
import expandIcon from "../assets/expand-task.svg";
import shrinkIcon from "../assets/shrink-task.svg";
import taskDoneIcon from "../assets/checked.svg";
import taskUndoneIcon from "../assets/unchecked.svg";
import { isMatch } from "date-fns";

const renderer = (() => {
    let projectsElement, TasksElement;

    const _cacheDom = () => {
        projectsElement = document.querySelector(".projects");
        TasksElement = document.querySelector(".tasks");
    }

    const _createProjectElement = (name) => {
        const projectEL = document.createElement("button");
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

    const _buttonElement = (imgSrc,alt=null) => {
        const buttonEL = document.createElement("button");
    
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = alt;
        img.classList.add("icon");
        buttonEL.append(img);
        return buttonEL;
    }

    const _createTaskElement = ({title, priority, dueDate, completed}) => {
        const taskEL = document.createElement("div");
        taskEL.classList.add("task");
        taskEL.classList.add(priority);

        const taskStatus = completed ? _buttonElement(taskDoneIcon, "Done") : _buttonElement(taskUndoneIcon, "Undone");

        const titleEL = document.createElement("p");
        titleEL.textContent = title;

        const editButtonEL = _buttonElement(editIcon, "Edit");
        const deleteButtonEL = _buttonElement(deleteIcon, "Delete");
        const dateEL = document.createElement("h5");
        dateEL.textContent = dueDate;

        const expandButtonEL = _buttonElement(expandIcon, "Expand")

        taskEL.append(taskStatus, titleEL, editButtonEL, deleteButtonEL, dateEL, expandButtonEL);
        return taskEL;
    };



    const renderProjects = (projects) => {
        projects.forEach(project => {
            _renderProject(project);
        });
    };

    const _renderProject = (project) => {
        const projectEL = _createProjectElement(project.name);
        projectsElement.append(projectEL);
        project.tasks.forEach(task => {
            _renderTask(task);
        });
    };

    const _renderTask = (task) => {
        const taskEL = _createTaskElement(task);
        TasksElement.append(taskEL);
    };

    _cacheDom();

    return { renderProjects };
})();

export default renderer;