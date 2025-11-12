<template>
  <div class="space-y-4">
    <div class="flex space-x-4">
      <!-- 头像 -->
      <img
        :src="comment.userAvatar"
        :alt="comment.username"
        class="w-10 h-10 rounded-full flex-shrink-0"
      />

      <!-- 内容 -->
      <div class="flex-1">
        <!-- 用户名和时间 -->
        <div class="flex items-center space-x-2 mb-2">
          <span class="font-medium text-gray-900">{{ comment.username }}</span>
          <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
        </div>

        <!-- 评论内容 -->
        <div class="text-gray-700 mb-3">{{ comment.content }}</div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4 text-sm">
          <button
            @click="emit('like', comment.id)"
            class="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <i class="far fa-thumbs-up mr-1"></i>
            {{ comment.likeCount }}
          </button>
          <button
            @click="emit('reply', comment.id)"
            class="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <i class="fas fa-reply mr-1"></i>
            回复
          </button>
          <button
            v-if="canDelete"
            @click="emit('delete', comment.id)"
            class="text-gray-500 hover:text-red-600 transition-colors"
          >
            <i class="fas fa-trash mr-1"></i>
            删除
          </button>
        </div>

        <!-- 子评论 -->
        <div v-if="comment.children && comment.children.length > 0" class="mt-4 space-y-4">
          <CommentItem
            v-for="child in comment.children"
            :key="child.id"
            :comment="child"
            :can-delete="canDelete"
            @like="emit('like', $event)"
            @reply="emit('reply', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Comment {
  id: number
  username: string
  userAvatar: string
  content: string
  likeCount: number
  createdAt: string
  children?: Comment[]
}

interface Props {
  comment: Comment
  canDelete?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  like: [id: number]
  reply: [id: number]
  delete: [id: number]
}>()

const formatDate = (date: string) => {
  return dayjs(date).fromNow()
}
</script>