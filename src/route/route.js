const Route = require('@koa/router');
const {HandleLogOut} = require("../controller/IndexController");
const {
    HandleLogin, LoginView, PostsView, IndexView
} = require("../controller/IndexController");

const blogRoute = new Route();
blogRoute.get('/', IndexView);

blogRoute.get('/posts', PostsView);

blogRoute.get('/posts/:id', PostsView);

blogRoute.get('/login.html', LoginView);

blogRoute.post('/login.html', HandleLogin);
blogRoute.get('/user/logout', HandleLogOut);


const initBlogRoute = (app) => {
    app.use(blogRoute.routes());
    app.use(blogRoute.allowedMethods());
};
module.exports = {
    initBlogRoute
};