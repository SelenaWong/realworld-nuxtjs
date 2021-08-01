<template>
    <div class="profile-page">
        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image"
                             class="user-img"/>
                        <h4>{{profile.username}}</h4>
                        <p>
                            {{profile.bio}}
                        </p>
                        <button v-if="profile.username!=user.username"
                                class="btn btn-sm btn-outline-secondary action-btn"
                                @click="followUser">
                            <i class="ion-plus-round"></i>
                            {{profile.following ? 'UnFollow':'Follow'}} {{profile.username}}
                        </button>
                        <nuxt-link v-else  to="/settings">
                            <button
                                    class="btn btn-sm btn-outline-secondary action-btn">
                                <i class="ion-gear-a"></i>&nbsp;Settings
                            </button>
                        </nuxt-link>
                    </div>

                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link class="nav-link"
                                           :class="{
                                                active: tab==='my_articles'
                                           }"
                                           exact
                                           :to="{name: 'profile',params: {username:this.profile.username}, query:{tab:'my_articles', page: 1}}">
                                    My Articles
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link"
                                           :class="{
                                                active: tab==='favorited_articles'
                                           }"
                                           exact
                                           :to="{name: 'profile',params: {username: this.profile.username}, query:{tab:'favorited_articles',page: 1}}">
                                    Favorited Articles
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>
                    <div v-if="loadArticles&&loadArticles.length"
                         class="article-preview" v-for="article in loadArticles" :key="article.slug">
                        <div class="article-meta">
                            <nuxt-link :to="{name:'profile', params:{username:article.author.username}}">
                                <img :src="article.author.image"/>
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link :to="{name:'profile', params:{username:article.author.username}}"
                                           class="author">{{article.author.username}}
                                </nuxt-link>
                                <span class="date">{{article.createdAt |date('MMM DD, YYYY')}}</span>
                            </div>
                            <button class="btn btn-outline-primary btn-sm pull-xs-right"
                                    :class="{active: article.favorited }"
                                    @click="onFavorite(article)"
                                    :disabled="article.favoriteDisabled">
                                <i class="ion-heart"></i> {{article.favoritesCount}}
                            </button>
                        </div>
                        <nuxt-link
                                class="preview-link"
                                :to="{
                                name:'article',
                                params:{
                                    slug: article.slug
                                }
                            }">
                            <h1>{{article.title}}</h1>
                            <p>{{article.description}}</p>
                            <span>Read more...</span>
                            <ul class="tag-list" v-if="article.tagList&&article.tagList.length">
                                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">
                                    {{tag}}
                                </li>
                            </ul>
                        </nuxt-link>
                    </div>
                    <!--分页页码-->
                    <ul v-if="articlesCount" class="pagination">
                        <li class="page-item ng-scope"
                            :class="{active: item=== page}"
                            v-for="item in totalPage" :key="item">
                            <nuxt-link class="page-link ng-binding"
                                       :to="{name: 'profile', params: {username: profile.username}, query:{tab:tab, page: item}}">
                                {{item}}
                            </nuxt-link>
                        </li>
                    </ul>
                    <!--分页页码-->
                </div>

            </div>
        </div>

    </div>
</template>
<script>
    import {getUserProfile} from "../../api/user";
    import {getArticles} from "../../api/article";

    export default {
        name: "UserProfile",
        //在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',

        data() {
            return {
                // profile: {
                //     image: '',
                //     bio: '',
                //     username: '',
                //     following: false
                // },
                // loadArticles: [],
                // articlesCount: 0,
                tab: '',
                // page: 1,
                // limit: 20,//接口默认是20
            }
        },
        computed: {
            totalPage() {
                //向上取整
                return Math.ceil(this.articlesCount / this.limit)
            }
        },
        //当路由中的查询参数变化时，页面重新渲染
        watchQuery: ['page', 'tab'],

        async asyncData({query, params, store}) {
            let page = Number.parseInt(query.page || 1)
            let {data} = store.state.user ? await getUserProfile(params.username) : null
            let tab = query?.tab || 'my_articles'
            let result = store.state.user && tab === 'my_articles' ? await getArticles({author: params.username}) : await getArticles({favorited: params.username})
            return {
                loadArticles: result?.data?.articles || [],
                articlesCount: result?.data?.articlesCount || 0,
                tab: tab,
                page: page,
                limit: 20,//接口默认是20
                profile: data?.profile,
                user: store.state.user
            }
        },

        methods: {
            followUser() {

            },
            settingUser() {

            }
        }
    }
</script>
