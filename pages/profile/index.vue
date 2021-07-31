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
                        <button class="btn btn-sm btn-outline-secondary action-btn"
                                @click="followUser">
                            <i class="ion-plus-round"></i>
                            {{profile.following ? 'UnFollow':'Follow'}} {{profile.username}}
                        </button>
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
                                <a class="nav-link active" href="">My Articles</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="">Favorited Articles</a>
                            </li>
                        </ul>
                    </div>

                    <div class="article-preview" v-for="article in myArticles" :key="article.slug">
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
                                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">{{tag}}</li>
                            </ul>
                        </nuxt-link>
                    </div>


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
                profile: {
                    image: '',
                    bio: '',
                    username: '',
                    following: false
                },
                myArticles: [],
                favoritedArticles: [],
                currentIndex: 0,
            }
        },


        async mounted() {
            let {data} = await getUserProfile(this.$route.params.username)
            this.profile = data.profile
            this.getFavoritedArticles()
            this.getMyArticles()
        },


        methods: {
            followUser() {

            },

            async getMyArticles() {
                let {data} = await getArticles({author: this.profile.username})
                this.myArticles = data.articles
            },
            async getFavoritedArticles() {
                let {data} = await getArticles({favorited: this.profile.username})
                this.favoritedArticles = data.articles
            }
        }
    }
</script>
