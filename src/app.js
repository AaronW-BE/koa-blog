const Koa = require('koa');
const Route = require('@koa/router');
const KoaStatic = require('koa-static');
const njs = require('koa-nunjucks-2');
const path = require('path');
const bodyParser = require('koa-bodyparser');

const logger = require('koa-logger')

const config = require('../config/config');

const blog = require('./store/blog');
const posts = require('./store/posts');

const route = new Route();
const app = new Koa();

app.use(njs({
    path: path.join(__dirname, 'view'),
    ext: 'njk',
    nunjucksConfig: {
        trimBlocks: true
    }
}));

app.use(async (ctx, next) => {
    ctx.state.blog = blog;
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

    await ctx.render('login');
});

route.post('/login.html', async ctx => {
    const {username, password} = ctx.request.body;
    let status = false;
    if (username === blog.username && password === blog.password) {
        status = true;
    }
    return ctx.render('login-result', {
        status
    })
});

app.use(route.routes());
app.use(route.allowedMethods());

app.use(KoaStatic(path.join(__dirname, '../static')));

app.listen(config.port, function () {
    console.log('app started at http://127.0.0.1:' + config.port);
});
