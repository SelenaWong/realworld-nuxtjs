import {request} from '@/plugins/request'


//获取首页文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}


//获取关注用户的文章列表
export const getFeedArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}

//添加点赞
export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`
    })
}


//取消点赞
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`
    })
}

//获取文章详情
export const getArticle = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
}

//获取文章评论
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
}

//创建文章
export const creatArticle = data => {
    return request({
        method: 'POST',
        url: '/api/articles',
        data
    })
}


//follow 用户
export const followUser = slug => {
    return request({
        method: 'POST',
        url: `/api/profiles/${slug}/follow`
    })
}
//un follow 用户
export const unFlollowUser = slug => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${slug}/follow`
    })
}

//更新文章
export const updateArticle = (slug, data) => {
    return request({
        method: 'PUT',
        url: `/api/articles/${slug}`,
        data
    })
}

//删除文章
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`
    })
}

//发布评论
export const createComments = (slug, data) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data
    })
}










