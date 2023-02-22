const users = [
    {
        id: 1,
        name: "Rebekah Johnson",
        email: "Glover12345@gmail.com",
        password: "123qwe",
    },
    {
        id: 2,
        name: "Fabian Predovic",
        email: "Connell29@gmail.com",
        password: "password",
    },
];

const posts = [
    {
        id: 1,
        title: "간단한 HTTP API 개발 시작!",
        content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
        userId: 1,
    },
    {
        id: 2,
        title: "HTTP의 특성",
        content: "Request/Response와 Stateless!!",
        userId: 2,
    },
];
let data = [];


function createData() {
    for (let post of posts) {
        const index = users.findIndex((user) => user.id === post.userId);
        data.push({
            "userId": post.userId,
            "userName": users[index].name,
            "postingId": post.id,
            "postingTitle": post.title,
            "postingContent": post.content
        })
    }
}

const http = require('http')

const server = http.createServer();

const httpRequestListener = function (request, response) {
    const {url, method} = request
    if (method === 'GET') {
        if (url === '/') {
            response.writeHead(200, {
                "Content-Type": "application/json"
            })
            response.end(JSON.stringify({message: 'Welcome!'}))
        } else if (url === '/users') {
            response.writeHead(200, {
                "Content-Type": "application/json"
            })
            response.end(JSON.stringify({"users": users}))
        } else if (url === '/posts') {
            data = [];
            createData();
            response.writeHead(200, {
                "Content-Type": "application/json"
            })
            response.end(JSON.stringify({"data": data}))
        }
    } else if (method === 'POST') {
        if (url === '/users') {
            let body = ''
            request.on('data', (data) => {
                body += data
            })
            request.on('end', () => {
                const user = JSON.parse(body)
                users.push({
                    id: parseInt(user.id),
                    name: user.name,
                    email: user.email,
                    password: user.password,
                })
                response.writeHead(200, {"Content-Type": "application/json"})
                response.end(JSON.stringify({"users": users, message: 'userCreated'}))

            })
        } else if (url === '/posts') {
            let body = ''
            request.on('data', (data) => {
                    body += data
                }
            )
            request.on('end', () => {
                const post = JSON.parse(body)
                posts.push({
                    id: parseInt(post.id),
                    title: post.title,
                    content: post.content,
                    userId: parseInt(post.userId),
                })
                response.writeHead(200, {"Content-Type": "application/json"})
                response.end(JSON.stringify({"posts": posts, message: 'postCreated'}))
            })
        }
    } else if (method === 'PATCH') {
        if (url === '/posts') {
            let body = '';
            request.on('data', (data) => {
                body += data
            })
            request.on('end', () => {
                const postUpdate = JSON.parse(body)
                for (let post of posts) {
                    if (parseInt(postUpdate.id) === post.id) {
                        data = [];
                        post.content = postUpdate.content
                        createData();
                    }
                }
                response.writeHead(200, {"Content-Type": "application/json"})
                response.end(JSON.stringify({"data": data}))
            })
        }
    } else if (method === 'DELETE') {
        if (url === '/posts') {
            let body = '';
            request.on('data', (data) => {
                body += data
            })
            request.on('end', () => {
                const postDelete = JSON.parse(body)
                for (let post of posts) {
                    if (parseInt(postDelete.id) === post.id) {
                        data = [];
                        posts.splice(post.id-1, 1)
                        createData()
                    }
                }
                response.writeHead(200, {"Content-Type": "application/json"})
                response.end(JSON.stringify({"data": data, message: "postingDeleted"}))
            })
        }
    }
}

server.on("request", httpRequestListener)

server.listen(8003, '127.0.0.1', function () {
    console.log('Listening to requests on port 8003')
})

