const ProjectManager = (() => { 
    const projects = [];
    let activeProject = null;

    const getProjects = () => {
        return projects;
    };

    const addProject = (project) => {
        projects.push(project);
    };

    const getActiveProject = () => {
        return activeProject;
    };

    const setActiveProject = (project) => {
        activeProject = project;
    };

    return {getProjects, addProject, getActiveProject, setActiveProject};

})();

class Project {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskId) {
        const task = this.tasks.find(
            task => task.id === taskId
        );
        const index = this.tasks.indexOf(task);
        this.tasks.slice(index, 1);
    }
}

class Task {
    constructor({title, description, priority, dueDate}) {
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