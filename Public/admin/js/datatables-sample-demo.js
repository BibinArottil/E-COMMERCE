window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const example = document.getElementById('example');
    if (example) {
        new simpleDatatables.DataTable(example);
    }
});
