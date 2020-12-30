const Koa = require('koa');
const Route = require('@koa/router');
const KoaStatic = require('koa-static');
const njs = require('koa-nunjucks-2');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const logger = require('koa-logger');

const config = require('../config/config');

let blog = require('./store/blog');
let posts = require('./store/posts');
const {checkAuth} = require("./middlewares/checkAuth");

const route = new Route();
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

app.use(async (ctx, next) => {
    ctx.state.blog = blog;
    if (ctx.session.username && ctx.session.isLogin) {
        ctx.state.username = ctx.session.username;
    }
    return next();
});

app.use(logger());
app.use(bodyParser());

route.get('/', async ctx => {
    await ctx.render('index', {
        posts
    })
});

route.get('/posts', async ctx => {
    await ctx.render('posts', {
        posts,
    });
});

route.get('/posts/:id', async ctx => {
    const {id} = ctx.params;
    let post = posts.find(item => String(item.id) === String(id));
    if (!post) {
        ctx.status = 404;
        return;
    }
    await ctx.render('post', {
        post,
    });
});

route.get('/login.html', async ctx => {
    if (ctx.session.isLogin && ctx.session.username) {
        ctx.redirect('/admin');
        return ;
    }
    await ctx.render('login');
});

route.post('/login.html', async ctx => {
    const {username, password} = ctx.request.body;
    let status = false;
    if (username === blog.username && password === blog.password) {
        status = true;
        ctx.session.isLogin = true;
        ctx.session.username = username;
    }
    return ctx.render('login-result', {
        status
    })
});

route.get('/user/logout', async ctx => {
    ctx.session = null;
    ctx.redirect('/')
});

route.get('/admin', checkAuth(), ctx => {
    return ctx.render('admin/index');
});

route.get('/admin/posts', checkAuth(), ctx => {
    return ctx.render('admin/posts', {
        posts
    });
});

route.get('/admin/posts/remove', async ctx => {
    let {id} = ctx.query;
    const postIndex = posts.findIndex(post => String(post.id) === String(id));
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        ctx.redirect('/admin/posts');
        return;
    }
    ctx.body = "删除失败，文章不存在";
});

route.post('/admin/posts/create', async ctx => {
    let {title, content} = ctx.request.body;
    console.log(title, content);
    let id = posts[posts.length - 1].id ;
    posts.push({
        id: ++id,
        title, content, summary: "日志 summary",
    })
    return ctx.redirect('/admin/posts');
});

route.get('/admin/blog', async ctx => {
    return ctx.render('admin/blog');
});

app.use(route.routes());
app.use(route.allowedMethods());

app.use(KoaStatic(path.join(__dirname, '../static')));

app.listen(config.port, function () {
    console.log('app started at http://127.0.0.1:' + config.port);
});
