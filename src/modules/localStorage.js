const storage = (() => {
    const saveData = (projects) => {
        localStorage.setItem("projects", JSON.stringify(projects));
    };

    const getData = () => {
        return JSON.parse(localStorage.getItem("projects"));
    };

    return {saveData, getData};
})();

export default storage;