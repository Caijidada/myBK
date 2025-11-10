<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
<div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
<!-- Header Navigation -->
<header class="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
<div class="flex items-center space-x-10">
<h1 class="text-xl font-bold text-blue-600">我的博客</h1>
<nav class="hidden md:flex space-x-6">
<a href="#" class="hover:text-blue-500 transition-colors">首页</a>
<a href="#" class="hover:text-blue-500 transition-colors">分类</a>
<a href="#" class="hover:text-blue-500 transition-colors">标签</a>
<a href="#" class="hover:text-blue-500 transition-colors">关于</a>
</nav>
</div>
<div class="flex items-center space-x-4">
<div class="relative">
<input
type="text"
placeholder="搜索文章..."
class="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-64 text-sm"
/>
<i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
<button class="!rounded-button whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm transition-colors">
登录 / 注册
</button>
</div>
</header>
<!-- Hero Section with Background Image -->
<section
class="relative h-[500px] overflow-hidden flex items-center justify-start pl-20"
style="background-image: url('https://ai-public.mastergo.com/ai/img_res/0e7b8206a62f4a69086015ada9bd5874.jpg'); background-size: cover; background-position: center;"
>
<div class="absolute inset-0 bg-black bg-opacity-30"></div>
<div class="relative max-w-lg z-10 text-white">
<h2 class="text-4xl font-bold mb-4">探索知识的无限可能</h2>
<p class="mb-6 text-lg opacity-90">
在这里，你可以找到各种技术分享、生活感悟和创意灵感。让我们一起成长，共同进步。
</p>
<button class="!rounded-button whitespace-nowrap bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-medium transition-colors">
开始阅读
</button>
</div>
</section>
<!-- Featured Articles Carousel -->
<section class="py-12 px-8">
<h2 class="text-2xl font-semibold mb-6 text-center">精选推荐</h2>
<Swiper
:modules="swiperModules"
:pagination="{ clickable: true }"
:autoplay="{ delay: 5000 }"
class="rounded-xl overflow-hidden shadow-lg"
>
<SwiperSlide v-for="(article, index) in featuredArticles" :key="index">
<div class="relative h-96">
<img
:src="article.image"
alt="Featured Article"
class="w-full h-full object-cover"
/>
<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
<h3 class="text-xl font-bold">{{ article.title }}</h3>
<p class="mt-2 text-sm opacity-90">{{ article.description }}</p>
</div>
</div>
</SwiperSlide>
</Swiper>
</section>
<!-- Category Navigation -->
<section class="py-10 px-8 bg-white">
<h2 class="text-2xl font-semibold mb-6 text-center">热门分类</h2>
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
<div
v-for="(category, index) in categories"
:key="index"
class="group cursor-pointer text-center"
>
<div class="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
<i :class="category.icon" class="text-blue-500 text-xl"></i>
</div>
<span class="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{{ category.name }}</span>
</div>
</div>
</section>
<!-- Tag Cloud -->
<section class="py-10 px-8 bg-gray-50">
<h2 class="text-2xl font-semibold mb-6 text-center">热门标签</h2>
<div class="flex flex-wrap justify-center gap-3">
<span
v-for="(tag, index) in tags"
:key="index"
class="px-4 py-2 bg-white rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
>
{{ tag }}
</span>
</div>
</section>
<!-- Article List -->
<section class="py-12 px-8 bg-white">
<div class="flex justify-between items-center mb-6">
<h2 class="text-2xl font-semibold">最新文章</h2>
<div class="flex space-x-2">
<button
class="!rounded-button whitespace-nowrap px-4 py-2 text-sm border border-gray-300 hover:border-blue-500 transition-colors"
@click="sortArticles('time')"
>
按时间排序
</button>
<button
class="!rounded-button whitespace-nowrap px-4 py-2 text-sm border border-gray-300 hover:border-blue-500 transition-colors"
@click="sortArticles('popularity')"
>
按热度排序
</button>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<div
v-for="(article, index) in articles"
:key="index"
class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
>
<img
:src="article.image"
:alt="article.title"
class="w-full h-48 object-cover"
/>
<div class="p-6">
<h3 class="text-lg font-semibold mb-2">
<a :href="'/article/' + article.id" class="hover:text-blue-600 transition-colors">{{ article.title }}</a>
</h3>
<p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ article.excerpt }}</p>
<div class="flex justify-between items-center text-xs text-gray-500">
<span>{{ article.date }}</span>
<div class="flex space-x-3">
<span><i class="far fa-eye mr-1"></i>{{ article.views }}</span>
<span><i class="far fa-thumbs-up mr-1"></i>{{ article.likes }}</span>
<span><i class="far fa-comment-alt mr-1"></i>{{ article.comments }}</span>
</div>
</div>
</div>
</div>
</div>
<div class="mt-10 flex justify-center">
<button class="!rounded-button whitespace-nowrap px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
加载更多
</button>
</div>
</section>
<!-- Footer -->
<footer class="bg-gray-800 text-white py-10 px-8">
<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
<div>
<h3 class="text-lg font-semibold mb-4">关于我们</h3>
<p class="text-gray-400 text-sm">
这是一个专注于技术和生活的博客平台，致力于分享高质量的内容，帮助读者获得有价值的信息。
</p>
</div>
<div>
<h3 class="text-lg font-semibold mb-4">快速链接</h3>
<ul class="space-y-2 text-gray-400 text-sm">
<li><a href="#" class="hover:text-white transition-colors">首页</a></li>
<li><a href="#" class="hover:text-white transition-colors">分类</a></li>
<li><a href="#" class="hover:text-white transition-colors">标签</a></li>
<li><a href="#" class="hover:text-white transition-colors">归档</a></li>
</ul>
</div>
<div>
<h3 class="text-lg font-semibold mb-4">联系方式</h3>
<ul class="space-y-2 text-gray-400 text-sm">
<li><i class="fas fa-envelope mr-2"></i> contact@example.com</li>
<li><i class="fab fa-github mr-2"></i> GitHub</li>
<li><i class="fab fa-twitter mr-2"></i> Twitter</li>
</ul>
</div>
<div>
<h3 class="text-lg font-semibold mb-4">订阅更新</h3>
<p class="text-gray-400 text-sm mb-3">获取最新的文章推送</p>
<div class="flex">
<input
type="email"
placeholder="你的邮箱"
class="px-4 py-2 text-sm rounded-l focus:outline-none w-full"
/>
<button class="!rounded-button whitespace-nowrap px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors rounded-r">
订阅
</button>
</div>
</div>
</div>
<div class="mt-10 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
© 2025 我的博客. 版权所有.
</div>
</footer>
</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
// Swiper modules
const swiperModules = [Pagination, Autoplay];
// Mock data for featured articles
const featuredArticles = ref([
{
title: '深入理解 Vue 3 Composition API',
description: '全面解析 Vue 3 新一代组合式 API 的设计理念与实践应用。',
image: 'https://ai-public.mastergo.com/ai/img_res/d7582bb138f2e22d0030d4318d086406.jpg',
},
{
title: 'TypeScript 高级技巧实战',
description: '掌握 TypeScript 的进阶特性，提高项目开发效率和代码质量。',
image: 'https://ai-public.mastergo.com/ai/img_res/fcfcaf0d351dd35c2f4bf856285c8e43.jpg',
},
{
title: 'Tailwind CSS 实战指南',
description: '如何利用 Tailwind CSS 构建现代化响应式网站界面。',
image: 'https://ai-public.mastergo.com/ai/img_res/477869083e044803748f6dbdda002cc5.jpg',
},
]);
// Mock data for categories
const categories = ref([
{ name: '前端开发', icon: 'fab fa-html5' },
{ name: '后端开发', icon: 'fas fa-server' },
{ name: '移动开发', icon: 'fas fa-mobile-alt' },
{ name: '人工智能', icon: 'fas fa-brain' },
{ name: '生活随笔', icon: 'fas fa-book-open' },
]);
// Mock data for tags
const tags = ref([
'JavaScript', 'Vue.js', 'React', 'Node.js', 'Python', '机器学习',
'CSS', 'HTML', 'TypeScript', 'Git', '数据库', '算法',
'面试题', '开源项目', '工具推荐', '读书笔记', '旅行日记', '摄影技巧'
]);
// Mock data for articles
const articles = ref([
{
title: '构建高性能 Web 应用的最佳实践',
excerpt: '本文探讨了提升 Web 应用性能的关键策略，包括资源优化、缓存机制和懒加载技术等。',
date: '2025-04-01',
views: 1245,
likes: 87,
comments: 23,
image: 'https://ai-public.mastergo.com/ai/img_res/b1b50a97d182ef988043edbe4d4c3bd8.jpg'
},
{
title: '现代前端框架状态管理深度剖析',
excerpt: '分析主流前端框架的状态管理模式及其适用场景，助力开发者做出更优架构决策。',
date: '2025-03-28',
views: 987,
likes: 65,
comments: 18,
image: 'https://ai-public.mastergo.com/ai/img_res/7470d960d3b327a5f70e5d7d38bef212.jpg'
},
{
title: '从零搭建企业级 Node.js 微服务架构',
excerpt: '详细介绍如何基于 Node.js 和 Docker 技术栈构建可扩展的企业级微服务系统。',
date: '2025-03-25',
views: 1567,
likes: 102,
comments: 31,
image: 'https://ai-public.mastergo.com/ai/img_res/94cf21363bb5e919d9d009152b970c51.jpg'
},
{
title: '数据可视化在业务决策中的作用',
excerpt: '通过实际案例阐述数据可视化如何帮助企业洞察趋势并驱动商业增长。',
date: '2025-03-20',
views: 876,
likes: 54,
comments: 12,
image: 'https://ai-public.mastergo.com/ai/img_res/644877ccdbe7ecffe0b641acfe930e25.jpg'
},
{
title: '区块链技术原理入门教程',
excerpt: '通俗易懂地讲解区块链核心技术概念，适合初学者快速入门。',
date: '2025-03-15',
views: 2103,
likes: 145,
comments: 42,
image: 'https://ai-public.mastergo.com/ai/img_res/fb2be9cd331612606702b5090d26140e.jpg'
},
{
title: 'DevOps 流水线自动化部署实践',
excerpt: '分享一套完整的 CI/CD 自动化流程实施方案，显著提升团队交付效率。',
date: '2025-03-10',
views: 1342,
likes: 98,
comments: 27,
image: 'https://ai-public.mastergo.com/ai/img_res/366355f955d24c66930b07c10ba43cf9.jpg'
},
]);
// Sort function placeholder
function sortArticles(sortBy: string) {
console.log(`Sorting by ${sortBy}`);
}
</script>
<style scoped>
.line-clamp-2 {
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
}
</style>