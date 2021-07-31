<template>
    <div class="article-meta">
        <nuxt-link
                :to="{
                     name:'profile',
                     params:{
                         username:article.author.username
                     }
                }"
        ><img :src="article.author.image"/></nuxt-link>
        <div class="info">
            <nuxt-link
                    class="author"
                    :to="{
                     name:'profile',
                     params:{
                         username:article.author.username
                     }
                    }">{{article.author.username}}
            </nuxt-link>
            <span class="date">{{article.createdAt| date('MMM DD, YYYY')}}</span>
        </div>

        <button
                v-if="!isCurrentUser()"
                class="btn btn-sm btn-outline-secondary"
                :class="{
                  active: article.author.following
                }"
                @click="onFollow">
            <i class="ion-plus-round"/>
            {{getFollowBtnTitle()}}
            <!--            {{ isFollowing ? 'UnFollow' : 'Follow' }} {{ article.author.username }}-->
        </button>
        &nbsp;&nbsp;
        <button
                v-if="!isCurrentUser()"
                class="btn btn-sm btn-outline-primary"
                @click="onFavorite"
        >
            <i class="ion-heart"></i>
            {{getFavoritedBtnTitle()}}
        </button>

        <button
                v-if="isCurrentUser()"
                class="btn btn-sm btn-outline-secondary"
                @click="onEdit">
            &nbsp
            Edit Article
        </button>
        <button
                v-if="isCurrentUser()"
                class="btn btn-sm btn-outline-secondary"
                @click="onDelete">
            &nbsp
            Delete Article
        </button>
    </div>
</template>
<script>
    import {getUserProfile} from "../../../api/user";
    import {
        addFavorite,
        deleteArticle,
        deleteFavorite,
        followUser,
        getArticle,
        unFlollowUser
    } from "../../../api/article";

    export default {
        name: 'ArticleMeta',
        props: {
            article: {
                type: Object,
                required: true
            },
            user: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                profile: null
            }
        },
        computed: {
            isFollowing() {
                return this.article?.author?.following
            }
        },
        created() {

        },

        mounted() {
            this.getAuthorInfo()
        },

        methods: {
            isCurrentUser() {
                return this.article?.author?.username === this.user?.username
            },

            async getAuthorInfo() {
                let {data} = await getUserProfile(this.article?.author?.username)
                this.profile = data.profile
            },
            async onFollow() {
                try {
                    let res = null
                    if (!this.profile?.following) {
                        res = await followUser(this.profile.username)
                    } else {
                        res = await unFlollowUser(this.profile.username)
                    }
                    this.article.author.following = res.data.profile.following
                } catch (err) {
                    // this.errors = err.response.data.errors
                }
            },
            async onFavorite() {
                try {
                    let res = null
                    if (!this.article?.favorited) {
                        res = await addFavorite(this.article.slug)
                    } else {
                        res = await deleteFavorite(this.article.slug)
                    }
                    this.article.favorited = res.data.article.favorited
                } catch (err) {
                    console.log(err)
                    // this.errors = err.response.data.errors
                }
            },
            onEdit() {
                this.$router.push(`/edit/${this.article.slug}`)
            },
            async onDelete() {
                try {
                    let res = await deleteArticle(this.article.slug)
                    this.$router.push('/')
                } catch (err) {
                    // this.errors = err.response.data.errors
                }
            },

            getFavoritedBtnTitle() {
                return this.article?.favorited ? `UnFavorite Article (${this.article?.favoritesCount})` : `Favorite Article (${this.article?.favoritesCount})`
            },
            getFollowBtnTitle() {
                return this.article?.author?.following ? `UnFollow ${this.article?.author?.username}` : `follow ${this.article?.author?.username}`
            }
        },

    }
</script>
