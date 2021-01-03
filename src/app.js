const Koa = require('koa');
const KoaStatic = require('koa-static');
const njs = require('koa-nunjucks-2');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const logger = require('koa-logger');

const config = require('../config/config');

let blog = require('./store/blog');
let posts = require('./store/posts');

const blogRoute = require('./route/route');
const {initAdminRoute} = require("./route/adminRoute");
const {initBlogRoute} = require("./route/route");

const {checkAuth} = require("./middlewares/checkAuth");

const app = new Koa();

app.keys = ['koa blog 1231213'];

app.use(session({}, app));

app.use(njs({
    path: path.join(__dirname, 'view'),
    ext: 'njk',
    nunjucksConfig: {
        trimBlocks: true
    }
}));

// MVC: modal, view, controller

app.use(async (ctx, next) => {
    ctx.state.blog = blog;
    ctx.state.posts = posts;
    if (ctx.session.username && ctx.session.isLogin) {
        ctx.state.username = ctx.session.username;
    }
    return next();
});

app.use(logger());
app.use(bodyParser());


initBlogRoute(app);

initAdminRoute(app);

app.use(KoaStatic(path.join(__dirname, '../static')));

app.listen(config.port, function () {
    console.log('app started at http://127.0.0.1:' + config.port);
});
