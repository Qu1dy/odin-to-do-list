const removeFromArray = (id, arr) => {
    const item = arr.find(
        item => item.id === id
    );
    const index = arr.indexOf(item);
    arr.splice(index, 1);
}

const ProjectManager = (() => {
    const projects = [];
    let activeProject = null;

    const getProjects = () => {
        return projects;
    };

    const addProject = (project) => {
        projects.push(project);
    };

    const removeProject = (projectId) => {
        removeFromArray(projectId, projects);
    }

    const getActiveProject = () => {
        return activeProject;
    };

    const setActiveProject = (project) => {
        activeProject = project;
    };

    return { getProjects, removeProject, addProject, getActiveProject, setActiveProject };

})();

class Project {
    #tasks;

    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.#tasks = [];
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    getTasks() {
        return this.#tasks;
    }

    removeTask(taskId) {
        removeFromArray(taskId, this.#tasks);
    }

    getTask(taskId) {
        return this.#tasks.find(task => task.id === taskId);
    }

    editTask(taskId, {title, description, priority, dueDate}) {
        const task = this.getTask(taskId)
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
    }
}

class Task {
    constructor({ title, description, priority, dueDate }) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
        this.id = crypto.randomUUID();
    }

    changeState = () => {
        this.completed = !this.completed;
    }
}

export { Task, Project, ProjectManager };