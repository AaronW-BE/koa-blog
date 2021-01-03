const IndexView = async ctx => {
    const posts = ctx.state.posts;
    await ctx.render('index', {
        posts
    })
};

const PostsView = async ctx => {
    const posts = ctx.state.posts;
    await ctx.render('posts', {
        posts,
    });
};

const PostView = async ctx => {
    const posts = ctx.state.posts;
    const {id} = ctx.params;
    let post = posts.find(item => String(item.id) === String(id));
    if (!post) {
        ctx.status = 404;
        return;
    }
    await ctx.render('post', {
        post,
    });
};

const LoginView = async ctx => {
    if (ctx.session.isLogin && ctx.session.username) {
        ctx.redirect('/admin');
        return;
    }
    await ctx.render('login');
};

const HandleLogin = async ctx => {
    const {blog} = ctx.state;
    const {username, password} = ctx.request.body;
    let status = false;
    if (username === blog.username && password === blog.password) {
        status = true;
        ctx.session.isLogin = true;
        ctx.session.username = username;
        ctx.redirect('/admin')
    }
    return ctx.render('login-result', {
        status
    })
};

const HandleLogOut = async ctx => {
    ctx.session = null;
    ctx.redirect('/')
};

module.exports = {
    IndexView,
    PostsView,
    PostView,
    LoginView,
    HandleLogin,
    HandleLogOut
};