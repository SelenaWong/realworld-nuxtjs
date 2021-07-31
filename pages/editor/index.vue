<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-10 offset-md-1 col-xs-12">
                    <ul class="error-messages">
                        <template v-for="(messages, field) in errors">
                            <li v-for="(message,index) in messages" :key="index">
                                {{field}} {{message}}
                            </li>
                        </template>
                    </ul>
                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control form-control-lg"
                                       v-model="article.title"
                                       placeholder="Article Title">
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control"
                                       v-model="article.description"
                                       placeholder="What's this article about?">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control"
                                          rows="8"
                                          v-model="article.body"
                                          placeholder="Write your article (in markdown)"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control"
                                       placeholder="Enter tags"
                                       v-model="inputTag"
                                       @keypress.enter.prevent="addTag(inputTag)">
                                <div class="tag-list">
                                    <span class="tag-default tag-pill"
                                          v-for="(tag, index) of article.tagList"
                                          :key="tag + index">
                                        <span class="ion-close-round" @click="removeTag(tag)"></span>
                                        {{tag}}
                                    </span>
                                </div>
                            </fieldset>
                            <button class="btn btn-lg pull-xs-right btn-primary"
                                    type="button"
                                    :disabled="isSubmitting"
                                    @click="onSubmit">
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import {creatArticle} from "../../api/article";

    export default {
        name: 'EditorIndex',
        //在路由匹配组件渲染之前会先执行中间件处理
        middleware: 'authenticated',
        data() {
            return {
                article: {
                    title: '',
                    description: '',
                    body: '',
                    tagList: []
                },
                inputTag: '',
                isSubmitting: false,
                errors: {//错误信息

                }
            }
        },
        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    let result = await creatArticle(this.article)
                    if (result?.data?.article?.slug) {
                        this.isSubmitting = false
                        //跳转到首页
                        this.$router.push(`/article/${result.data.article.slug}`)
                    }
                } catch (err) {
                    this.errors = err.response.data.errors
                    this.isSubmitting = false
                }
            },

            addTag(tag) {
                let index = this.article.tagList.findIndex(item => item === tag)
                if (index != -1) {
                    return
                }
                this.article.tagList.push(tag)
                this.inputTag = ''
            },
            removeTag(tag) {
                this.article.tagList = this.article.tagList.filter(item => item != tag)
                console.log(this.article.tagList)
            }
        },
    }
</script>
