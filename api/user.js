import {request} from '@/plugins/request'

//用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}


//用户注册
export const register = data => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}


//获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/api/user'
    })
}

//获取其他用户信息
export const getUserProfile = slug => {
    return request({
        method: 'GET',
        url: `/api/profiles/${slug}`
    })
}
