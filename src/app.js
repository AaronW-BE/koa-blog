const Koa = require('koa');
const Route = require('@koa/router');
const KoaStatic = require('koa-static');
const njs = require('koa-nunjucks-2');
const path = require('path');
const config = require('../config/config');

const route = new Route();
const app = new Koa();

app.use(njs({
    path: path.join(__dirname, 'view'),
    ext: 'njk',
    nunjucksConfig: {
        trimBlocks: true
    }
}));

route.get('/', async ctx => {
    let time = new Date();
    await ctx.render('index', {
        name: "my blog",
        date: time
    })
});

route.get('/posts', async ctx => {
    await ctx.render('posts', {
        posts: [
            {title: '这是第一个日志', description: '', author: ''},
            {title: '这是第一个日志', description: '', author: ''},
            {title: '这是第一个日志', description: '', author: ''}
        ]
    });
});

app.use(route.routes());
app.use(route.allowedMethods());

app.use(KoaStatic(path.join(__dirname, '../static')));

app.listen(config.port, function () {
    console.log('app started at http://127.0.0.1:' + config.port);
});