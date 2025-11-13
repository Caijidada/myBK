<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <h1 class="text-4xl font-bold mb-3 text-gray-800">每日算法</h1>
        <p class="text-lg text-gray-600">
          今日题目：{{ todayProblem.title }} —— {{ todayProblem.description }}
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-8 py-12">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">今日题目</h2>
            <div class="mt-1 text-gray-500 text-sm">难度：
              <span :class="difficultyClass(todayProblem.difficulty)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ todayProblem.difficulty }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button @click="startPractice" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">开始练习</button>
            <button @click="viewSolutions" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition-colors">查看思路</button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="text-gray-800 leading-7">
            {{ todayProblem.content }}
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            输入输出示例：
            <div class="mt-2">
              <div class="font-mono bg-white border border-gray-200 rounded p-3 inline-block">输入: {{ todayProblem.examples.input }}</div>
            </div>
            <div class="mt-2">
              <div class="font-mono bg-white border border-gray-200 rounded p-3 inline-block">输出: {{ todayProblem.examples.output }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h3 class="text-xl font-bold text-gray-900 mb-4">在线编译运行</h3>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="text-gray-600">语言：</div>
            <el-select v-model="selectedLanguage" class="w-40">
              <el-option label="Python" value="python" />
              <el-option label="Java" value="java" />
              <el-option label="C++" value="cpp" />
            </el-select>
            <div v-if="selectedVersion" class="text-gray-500 text-sm">版本：{{ selectedVersion }}</div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div class="text-sm text-gray-600 mb-2">代码</div>
              <el-input v-model="sourceCode" type="textarea" :rows="14" class="font-mono" />
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-2">标准输入</div>
              <el-input v-model="stdin" type="textarea" :rows="14" />
            </div>
          </div>

          <div class="mt-4">
            <el-button type="primary" :loading="running" @click="runCode">运行</el-button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <div class="text-sm text-gray-600 mb-2">编译输出</div>
              <div class="bg-gray-50 rounded-lg p-3 min-h-[120px] whitespace-pre-wrap font-mono text-sm">{{ compileOutput || '无' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 mb-2">运行输出</div>
              <div class="bg-gray-50 rounded-lg p-3 min-h-[120px] whitespace-pre-wrap font-mono text-sm">{{ runOutput || '无' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <h3 class="text-xl font-bold text-gray-900 mb-4">往期题目</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in historyProblems"
            :key="item.id"
            class="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{{ item.title }}</h4>
              <span :class="difficultyClass(item.difficulty)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ item.difficulty }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2">{{ item.description }}</p>
            <div class="mt-4 text-xs text-gray-500">更新于 {{ item.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const todayProblem = ref({
  title: '两数之和',
  difficulty: '简单',
  description: '给定一个整数数组和一个目标值，找出数组中和为目标值的两个数的下标。',
  content: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。你可以按任意顺序返回答案。',
  examples: {
    input: 'nums = [2,7,11,15], target = 9',
    output: '[0,1]'
  }
})

const historyProblems = ref([
  {
    id: 1,
    title: '有效的括号',
    difficulty: '简单',
    description: '判断由括号组成的字符串是否有效配对。',
    date: '2025-11-10'
  },
  {
    id: 2,
    title: '二叉树的层序遍历',
    difficulty: '中等',
    description: '按层遍历二叉树并返回每层节点值。',
    date: '2025-11-09'
  },
  {
    id: 3,
    title: 'LRU 缓存机制',
    difficulty: '困难',
    description: '设计并实现一个支持 O(1) 读写的 LRU 缓存。',
    date: '2025-11-08'
  }
])

const difficultyClass = (level: string) => {
  if (level === '简单') return 'bg-green-100 text-green-700'
  if (level === '中等') return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

const startPractice = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewSolutions = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

const selectedLanguage = ref<'python' | 'java' | 'cpp'>('python')
const selectedVersion = ref('')
const runtimes = ref<any[]>([])
const sourceCode = ref('')
const stdin = ref('')
const running = ref(false)
const compileOutput = ref('')
const runOutput = ref('')

const templates: Record<string, string> = {
  python: "print('Hello, World!')",
  java: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  cout << "Hello, World!" << endl;\n  return 0;\n}'
}

const fileName = (lang: string) => {
  if (lang === 'python') return 'main.py'
  if (lang === 'java') return 'Main.java'
  return 'main.cpp'
}

const resolveVersion = (lang: string) => {
  const list = runtimes.value.filter((r: any) => r.language === lang)
  if (list.length === 0) return ''
  return list[list.length - 1].version
}

const fetchRuntimes = async () => {
  const { data } = await axios.get('https://emkc.org/api/v2/piston/runtimes')
  runtimes.value = data
  selectedVersion.value = resolveVersion(selectedLanguage.value)
}

const runCode = async () => {
  compileOutput.value = ''
  runOutput.value = ''
  running.value = true
  try {
    const payload = {
      language: selectedLanguage.value,
      version: selectedVersion.value,
      files: [{ name: fileName(selectedLanguage.value), content: sourceCode.value }],
      stdin: stdin.value
    }
    const { data } = await axios.post('https://emkc.org/api/v2/piston/execute', payload)
    const c = data.compile || { stdout: '', stderr: '' }
    const r = data.run || { stdout: '', stderr: '' }
    compileOutput.value = (c.stdout || '') + (c.stderr || '')
    runOutput.value = (r.stdout || '') + (r.stderr || '')
  } catch (e: any) {
    runOutput.value = '请求失败或网络错误'
  } finally {
    running.value = false
  }
}

onMounted(async () => {
  sourceCode.value = templates[selectedLanguage.value]
  await fetchRuntimes()
})

watch(selectedLanguage, () => {
  sourceCode.value = templates[selectedLanguage.value]
  selectedVersion.value = resolveVersion(selectedLanguage.value)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>