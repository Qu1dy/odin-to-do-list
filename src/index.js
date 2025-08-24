import "./style.css"; 
import renderer from "./modules/renderer.js";
import {Task, Project} from "./modules/taskManager.js"; 

(() => {
    const p1 = new Project("Meow");
    const task1 = new Task("meow meow", "", "high", "07/04/2025");
    task1.changeState();
    p1.addTask(task1);
    const projects = Project.getProjects();
    renderer.renderProjects(projects);
    renderer.renderProject(p1);
})();