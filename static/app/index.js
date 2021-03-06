import Xtodo from '../framework';

fetch('/api/todos')
.then(response =>response.json())
.then(todos => {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    function changeStatus(id, status, data) {
        return fetch('/api/todos/' + id, {
            method: 'PATCH',
            body: JSON.stringify({
                status
            }),
            headers
        })
        .then(response =>response.json());
    }

    new Xtodo({
        el: '#root', 
        data: {
            title: 'TODO LIST',
            addShow: 'hide',
            addShowTmp: 'hide',
            tagShow: 'tagclick',
            delListContent: '',
            tagcluster:'yoyoyo',
            todos
        },
        handlers: {
            addTask: (e, data) => {
                data.addShow = 'show';
            },
            addTaskTmp: (e, data) => {
                data.addShowTmp = 'show';
            },
            changeAddListTag: (e, data) => {
                data.addListContent = e.target.value;
            },
            changeDelListTag: (e, data, path) => {
                data.delListContent = e.target.innerHTML;
                let eText = document.getElementById("delText");
                eText.innerText = " " + data.delListContent;
            },
            changeModifyListTag: (e, data) => {
                data.modifyListContent = e.target.value;
            },
            changeTime: (e, data) => {
                 data.time = e.target.value;
            },
            changeAddContent: (e, data) => {
                data.addContent = e.target.value;
            },
            changeAddTags: (e, data) => {
                data.addTags = e.target.value;
            },
             changeAddContentTmp: (e, data) => {
                data.addContentTmp = e.target.value;
            },
            changeAddTagsTmp: (e, data) => {
                data.addTagsTmp = e.target.value;
            },
            stateWait: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'wait', data).then(ret => todo.status = ret.status);
            },
            stateDoing: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'doing', data).then(ret => todo.status = ret.status);
            },
            stateDone: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                changeStatus(todo.id, 'done', data).then(ret => todo.status = ret.status);
            },
            submit: (e, data) => {
                e.preventDefault();
                let times = data.time;
                if(times == null)
                    times = "今日待办";

                fetch('/api/todos', {
                    method: 'POST',
                    body: JSON.stringify({
                        tags: data.addTags,
                        task: data.addContent,
                        times
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(todo => {
                    data.todos.push(todo);
                    data.addShow = 'hide';
                });
                location.reload();
            },
            addListTag: (e, data, path) => {
                e.preventDefault();
                let todo = data[path[0]][path[1]];
                todo.tags.push(data.addListContent.split(',').map(name => ({name}))[0]);
                let tags = todo.tags;
                fetch('/api/todos/' + todo.id, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        tags
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(ret => todo.tags = ret.tags);
                location.reload();
            },
            delListTag: (e, data, path) => {
                e.preventDefault();
                let todo = data[path[0]][path[1]];
                const searchTag = todo.tags.filter(tag => tag.name == data.delListContent)[0];
                todo.tags.splice(todo.tags.indexOf(searchTag), 1);
                let tags = todo.tags;
                fetch('/api/todos/' + todo.id, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        tags
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(ret => todo.tags = ret.tags);
                location.reload();
            },
            modifyListTag: (e, data, path) => {
                e.preventDefault();
                let todo = data[path[0]][path[1]];
                const searchTag = todo.tags.filter(tag => tag.name == data.delListContent)[0];
                todo.tags.splice(todo.tags.indexOf(searchTag), 1, data.modifyListContent.split(',').map(name => ({name}))[0]);
             
                let tags = todo.tags;
                fetch('/api/todos/' + todo.id, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        tags
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(ret => todo.tags = ret.tags);
                location.reload();
            },
            submitTmp: (e, data) => {
                e.preventDefault();
                let times = "";

                fetch('/api/todos', {
                    method: 'POST',
                    body: JSON.stringify({
                        tags: data.addTagsTmp,
                        task: data.addContentTmp,
                        times
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(todo => {
                    data.todos.push(todo);
                    data.addShowTmp = 'hide';
                });
            },
            submitTime: (e, data, path) => {
                e.preventDefault();
                let times = data.time;
                if(times == null)
                    times = "今日待办";
                let todo = data[path[0]][path[1]];


                fetch('/api/todos/' + todo.id, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        times
                    }),
                    headers
                })
                .then(response =>response.json())
                .then(ret => todo.times = ret.times);
                location.reload();
            },
            delTime: (e, data, path) => {
                e.preventDefault();
                let times = "";
                let todo = data[path[0]][path[1]];
                fetch('/api/todos/' + todo.id, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        times
                    }),
                    headers
                })
                .then(response =>response.json())
                todo.times = "";
                location.reload();
            },
            delTask: (e, data, path) => {
                let todo = data[path[0]][path[1]];
                
                return fetch('/api/todos/' + todo.id , {
                    method: 'DELETE',
                })
                .then(response =>response.json())
                .then(delTodo => {
                    const searchTodo = data.todos.filter(todo => todo.id == delTodo.id)[0];
                    data.todos.splice(data.todos.indexOf(searchTodo), 1);
                });
            }
        }
    });

});
