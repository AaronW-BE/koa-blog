const Route = require('@koa/router');
const {checkAuth} = require("../middlewares/checkAuth");
const {HandlePostCreate,
    AdminBlogSet,
    HandlePostRemove,
    AdminPosts,
    AdminIndex,
} = require("../controller/AdminController");

let adminRoute = new Route({
    prefix: '/admin'
});

adminRoute.use(checkAuth());

adminRoute.get('/', AdminIndex);

adminRoute.get('/posts',  AdminPosts);

adminRoute.get('/posts/remove', HandlePostRemove);

adminRoute.post('/posts/create', HandlePostCreate);

adminRoute.get('/blog', AdminBlogSet);
const initAdminRoute = (app) => {
    app.use(adminRoute.routes());
    app.use(adminRoute.allowedMethods());
};
module.exports = {
    initAdminRoute
};