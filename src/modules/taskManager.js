import {isWithinInterval, parse, addWeeks} from "date-fns";

const removeFromArray = (id, arr) => {
    const item = arr.find(
        item => item.id === id
    );
    const index = arr.indexOf(item);
    arr.splice(index, 1);
};

const ProjectManager = (() => {
    const projects = [];
    let activeProject = null;

    const getProjects = () => {
        return projects;
    };

    const addProject = (project) => {
        projects.push(project);
    };

    const getProjectById = (projectId) => {
        return projects.find(project => project.id === projectId);
    };

    const removeProject = (projectId) => {
        removeFromArray(projectId, projects);
    };

    const getActiveProject = () => {
        return activeProject;
    };

    const editProject = (projectId, name) => {
        const project = getProjectById(projectId);
        project.name = name;
    };

    const setActiveProject = (projectId) => {
        activeProject = projects.find(project => project.id === projectId);
    };

    const clearActiveProject = () => {
        activeProject = null;
    };

    const getAllTasks = () => {
        const allTasks = [];
        projects.forEach(project => {
            const projectTasks = project.getTasks();
            allTasks.push(...projectTasks);
        });
        return allTasks;
    };

    const getCompletedTasks = () => {
        const allTasks = getAllTasks();
        const completedTasks = allTasks.filter(task => task.completed);
        return completedTasks;
    };

    const _isDueThisWeek = (task) => {
        const dueDateAsTime = parse(task.dueDate, "yyyy-MM-dd", new Date());
        const today = new Date();
        const inAWeek = addWeeks(today, 1);
        const interval = {start: today, end: inAWeek};

        return isWithinInterval(dueDateAsTime, interval);
    };

    const getTasksDueThisWeek = () => {
        const allTasks = getAllTasks();
        const dueThisWeek = allTasks.filter(_isDueThisWeek); 

        return dueThisWeek;
    };

    return { editProject, getTasksDueThisWeek, clearActiveProject, getCompletedTasks, getAllTasks, getProjects, getProjectById, removeProject, addProject, getActiveProject, setActiveProject };

})();

class Project {
    #tasks;

    constructor(name, id) {
        this.name = name;
        this.id = id || crypto.randomUUID();
        this.#tasks = [];
        ProjectManager.addProject(this);
    }

    addTask(task) {
        task.projectName = this.name;
        this.#tasks.push(task);
    }

    toJSON() {
        return {
            name: this.name,
            tasks: this.#tasks
        };
    }

    getTasks() {
        return this.#tasks;
    }

    get active() {
        return ProjectManager.getActiveProject() === this;
    }

    removeTask(taskId) {
        removeFromArray(taskId, this.#tasks);
    }

    getTaskById(taskId) {
        return this.#tasks.find(task => task.id === taskId);
    }

    editTask(taskId, { title, description, priority, dueDate }) {
        const task = this.getTaskById(taskId);
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
    }
}

class Task {
    constructor({ title, description, priority, dueDate, completed, projectName, id}) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed || false;
        this.projectName = projectName || null;
        this.id = id || crypto.randomUUID();
    }

    get status() {
        return this.completed ? "Done" : "Not done yet";
    }

    changeState = () => {
        this.completed = !this.completed;
    }
}

export { Task, Project, ProjectManager };