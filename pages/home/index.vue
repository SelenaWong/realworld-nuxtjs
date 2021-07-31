<template>
    <div class="home-page">
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>
        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li v-if="user" class="nav-item">
                                <nuxt-link class="nav-link"
                                           :class="{
                                                active: tab==='your_feed'
                                           }"
                                           exact
                                           :to="{name:'home',query:{tab:'your_feed'}}">Your Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link"
                                           :class="{
                                            active: tab==='global_feed'
                                           }"
                                           exact
                                           :to="{name:'home',query:{tab:'global_feed'}}">Global
                                    Feed
                                </nuxt-link>
                            </li>
                            <li v-if="tag" class="nav-item">
                                <nuxt-link class="nav-link"
                                           exact
                                           :class="{
                                             active: tab==='tag'
                                           }"
                                           :to="{name:'home',query:{tab:'tag',tag:tag}}">#{{tag}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>
                    <div class="article-preview" v-for="article in articles" :key="article.slug">
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
                        </nuxt-link>
                    </div>
                </div>

                <!--分页页码-->
                <ul class="pagination">
                    <li class="page-item ng-scope"
                        :class="{active: item=== page}"
                        v-for="item in totalPage" :key="item">
                        <nuxt-link class="page-link ng-binding"
                                   :to="{name:'home', query:{tab:tab, tag:$route.query.tag, page:item}}">{{item}}
                        </nuxt-link>
                    </li>
                </ul>
                <!--分页页码-->

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>
                        <div class="tag-list">
                            <nuxt-link class="tag-pill tag-default"
                                       :to="{name:'home', query:{tab: 'tag', tag:item, page:1}}"
                                       v-for="item in tags" :key="item">{{item}}
                            </nuxt-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

</template>
<script>
    import {getArticles, getFeedArticles, addFavorite, deleteFavorite} from "@/api/article";
    import {getTags} from "@/api/tag";
    import {mapState} from 'vuex'

    export default {
        name: "HomePage",
        components: {},
        props: {},
        data() {
            return {
                isAuthenticated: true,
                tag: null
            }
        },
        computed: {
            totalPage() {
                //向上取整
                return Math.ceil(this.articlesCount / this.limit)
            },
            ...mapState(['user'])
        },
        watch: {},
        created() {
        },
        mounted() {
        },
        //当路由中的查询参数变化时，页面重新渲染
        watchQuery: ['page', 'tag', 'tab'],
        methods: {
            async onFavorite(article) {
                try {
                    article.favoriteDisabled = true
                    if (article.favorited) {
                        //取消点赞
                        await deleteFavorite(article.slug)
                        article.favorited = false
                        article.favoritesCount += -1
                    } else {
                        //添加点赞
                        await addFavorite(article.slug)
                        article.favorited = true
                        article.favoritesCount += 1
                    }
                    article.favoriteDisabled = false
                }catch (e) {
                    console.log(e)
                }
            }
        },
        async asyncData({query, store}) {
            const page = Number.parseInt(query.page || 1)
            const limit = 10
            const {tag} = query
            const tab = query.tab || 'global_feed'
            const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles


            const [articleRes, tagRes] = await Promise.all([
                loadArticles({
                    limit: limit,
                    offset: (page - 1) * limit
                }),
                getTags()
            ])
            const {articles, articlesCount} = articleRes.data
            const {tags} = tagRes.data
            articles.forEach(article => article.favoriteDisabled = false)
            return {
                articles,
                articlesCount,
                tags,
                page,
                limit,
                tag,
                tab: query.tab || 'global_feed'
            }
        }
    }

</script>
<style scoped>

</style>

