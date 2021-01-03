const AdminIndex = async ctx => {
    return ctx.render('admin/index');
};

const AdminPosts = async ctx => {
    const {posts} = ctx.state;
    return ctx.render('admin/posts', {
        posts
    });
};

const HandlePostRemove = async ctx => {
    const {posts} = ctx.state;
    let {id} = ctx.query;
    const postIndex = posts.findIndex(post => String(post.id) === String(id));
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        ctx.redirect('/admin/posts');
        return;
    }
    ctx.body = "删除失败，文章不存在";
};

const HandlePostCreate =async ctx => {
    let {title, content} = ctx.request.body;
    const {posts} = ctx.state;
    console.log(title, content);
    let id = posts[posts.length - 1].id ;
    posts.push({
        id: ++id,
        title, content, summary: "日志 summary",
    })
    return ctx.redirect('/admin/posts');
}

const AdminBlogSet = async ctx => {
    return ctx.render('admin/blog');
}
module.exports = {
    AdminIndex,
    AdminPosts,

    HandlePostRemove,
    HandlePostCreate,
    AdminBlogSet
};
