<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>
                    <ul class="error-messages">
                        <template v-for="(messages, field) in errors">
                            <li v-for="(message,index) in messages" :key="index">
                                {{field}} {{message}}
                            </li>
                        </template>
                    </ul>
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input class="form-control"
                                       type="text"
                                       placeholder="URL of profile picture"
                                       v-model="user.image">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg"
                                       type="text"
                                       placeholder="Your Name"
                                       v-model="user.username">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control form-control-lg"
                                          rows="8"
                                          placeholder="Short bio about you"
                                          v-model="user.bio"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg"
                                       type="text"
                                       placeholder="Email"
                                       v-model="user.email">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg"
                                       type="password"
                                       placeholder="Password"
                                       v-model="user.password">
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right"
                                    :disabled="isSubmitting"
                                    @click="onSubmit">
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                    <button class="btn btn-outline-danger"
                            @click="goLogout">
                        click to logout
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import {getUserInfo, updateUserInfo} from "../../api/user";
    //仅在客户端加载js-cookie包
    const Cookie = process.client ? require('js-cookie') : undefined

    export default {
        name: "SettingIndex",
        //在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',
        data() {
            return {
                isSubmitting: false,
                errors: {//错误信息

                }
            }
        },
        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const {data} = await updateUserInfo({
                        user: this.user
                    })
                    //TODO: 保存用户的登录状态
                    this.$store.commit('setUser', data.user)
                    //为了防止刷新页面数据丢失，我们需要把数据持久化
                    Cookie.set('user', data.user)
                    this.isSubmitting = false
                    this.errors = null
                    this.$router.push({
                        path:`/profile/${this.user.username}`
                    })
                } catch (err) {
                    this.isSubmitting = false
                    this.errors = err.response.data.errors
                }
            },
            goLogout(){
                Cookie.remove('user')
                this.$store.commit('setUser',null)
                this.$router.push('/')
            }
        },

        async asyncData() {
            let {data} = await getUserInfo()
            const user = data.user
            return {
                user: {...user, password: ''}
            }
        }
    }
</script>
