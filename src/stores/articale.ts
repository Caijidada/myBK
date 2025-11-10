import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/types'

export const useArticleStore = defineStore('article', () => {
  // 当前文章
  const currentArticle = ref<Article | null>(null)
  
  // 文章列表缓存
  const articlesCache = ref<Map<number, Article>>(new Map())

  // 设置当前文章
  const setCurrentArticle = (article: Article) => {
    currentArticle.value = article
    articlesCache.value.set(article.id, article)
  }

  // 获取缓存的文章
  const getCachedArticle = (id: number) => {
    return articlesCache.value.get(id)
  }

  // 清空当前文章
  const clearCurrentArticle = () => {
    currentArticle.value = null
  }

  // 清空缓存
  const clearCache = () => {
    articlesCache.value.clear()
  }

  return {
    currentArticle,
    articlesCache,
    setCurrentArticle,
    getCachedArticle,
    clearCurrentArticle,
    clearCache
  }
})

