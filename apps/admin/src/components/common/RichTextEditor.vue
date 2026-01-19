<!--
  富文本编辑器组件
  
  需要安装以下依赖:
  pnpm add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
  
  使用方法:
  <RichTextEditor v-model="content" placeholder="请输入内容" />
-->

<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div v-if="editor" class="editor-toolbar">
      <!-- 文本格式化 -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
          title="粗体"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
          title="斜体"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
          title="删除线"
        >
          <s>S</s>
        </button>
      </div>

      <!-- 标题 -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          title="标题 1"
        >
          H1
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          title="标题 2"
        >
          H2
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          title="标题 3"
        >
          H3
        </button>
      </div>

      <!-- 列表 -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
          title="无序列表"
        >
          •
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
          title="有序列表"
        >
          1.
        </button>
      </div>

      <!-- 引用和代码 -->
      <div class="toolbar-group">
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
          title="引用"
        >
          "
        </button>
        <button
          type="button"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          title="代码块"
        >
          &lt;/&gt;
        </button>
      </div>

      <!-- 插入 -->
      <div class="toolbar-group">
        <button type="button" @click="handleInsertImage" title="插入图片">图</button>
        <button type="button" @click="handleInsertLink" title="插入链接">链</button>
      </div>

      <!-- 其他 -->
      <div class="toolbar-group">
        <button
          type="button"
          @click="editor.chain().focus().setHorizontalRule().run()"
          title="分隔线"
        >
          —
        </button>
        <button
          type="button"
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          title="撤销"
        >
          ↶
        </button>
        <button
          type="button"
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          title="重做"
        >
          ↷
        </button>
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

// Props
interface Props {
  modelValue?: any
  placeholder?: string
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '请输入内容...',
  editable: true,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

// 编辑器实例
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // 禁用 StarterKit 中的 link，使用自定义配置
      link: false,
    }),
    Image,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  ],
  content: getInitialContent(props.modelValue),
  editable: props.editable,
  onUpdate: ({ editor }) => {
    // 始终输出 HTML 格式，而不是 JSON 配置格式
    emit('update:modelValue', editor.getHTML())
  },
})

// 获取初始内容
function getInitialContent(value: any) {
  // 如果是 null 或 undefined，返回空段落
  if (value == null) {
    return '<p></p>'
  }

  // 如果是空对象，返回空段落
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return '<p></p>'
  }

  // 如果是字符串（HTML），直接返回
  if (typeof value === 'string') {
    return value || '<p></p>'
  }

  // 如果是有效的 Tiptap JSON 对象（兼容旧数据），Tiptap 会自动处理
  // 但我们会确保输出始终是 HTML 格式
  if (typeof value === 'object' && value.type) {
    // Tiptap 的 setContent 可以接受 JSON，但我们需要确保输出是 HTML
    // 这里先返回 JSON，编辑器初始化后会自动处理
    return value
  }

  // 其他情况返回空段落
  return '<p></p>'
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value != null) {
      const currentContent = editor.value.getHTML()
      // 对于字符串（HTML）直接比较
      if (typeof value === 'string') {
        if (currentContent !== value) {
          editor.value.commands.setContent(value)
          // setContent 会触发 onUpdate，自动输出 HTML 格式
        }
      } else if (typeof value === 'object') {
        // 如果是 JSON 对象（兼容旧数据），转换为 HTML
        const currentJson = editor.value.getJSON()
        const isSame = JSON.stringify(currentJson) === JSON.stringify(value)
        if (!isSame) {
          // 设置 JSON 内容，Tiptap 会自动处理并触发 onUpdate
          // onUpdate 会将 JSON 转换为 HTML 并输出
          editor.value.commands.setContent(value)
        }
      } else {
        // 其他情况设置为空
        editor.value.commands.setContent('<p></p>')
      }
    } else if (editor.value && value == null) {
      // 如果值为 null，清空编辑器
      editor.value.commands.setContent('<p></p>')
    }
  }
)

// 监听 editable 变化
watch(
  () => props.editable,
  (value) => {
    if (editor.value) {
      editor.value.setEditable(value)
    }
  }
)

// 插入图片
async function handleInsertImage() {
  try {
    const { value: url } = await ElMessageBox.prompt('请输入图片 URL', '插入图片', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^http?:\/\/.+/,
      inputErrorMessage: '请输入有效的图片 URL',
    })

    if (url && editor.value) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  } catch {
    // 用户取消
  }
}

// 插入链接
async function handleInsertLink() {
  try {
    const { value: url } = await ElMessageBox.prompt('请输入链接 URL', '插入链接', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^https?:\/\/.+/,
      inputErrorMessage: '请输入有效的链接 URL',
    })

    if (url && editor.value) {
      editor.value.chain().focus().setLink({ href: url }).run()
    }
  } catch {
    // 用户取消
  }
}

// 清理
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped lang="scss">
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;

    .toolbar-group {
      display: flex;
      gap: 4px;
      padding: 0 8px;
      border-right: 1px solid #dcdfe6;

      &:last-child {
        border-right: none;
      }

      button {
        padding: 4px 8px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;

        &:hover {
          background-color: #ecf5ff;
          border-color: #409eff;
        }

        &.is-active {
          background-color: #409eff;
          color: white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  .editor-content {
    min-height: 300px;
    padding: 15px;

    :deep(.ProseMirror) {
      outline: none;
      min-height: 300px;

      > * + * {
        margin-top: 0.75em;
      }

      h1 {
        font-size: 2em;
        font-weight: bold;
      }

      h2 {
        font-size: 1.5em;
        font-weight: bold;
      }

      h3 {
        font-size: 1.25em;
        font-weight: bold;
      }

      ul,
      ol {
        padding-left: 1.5em;
      }

      blockquote {
        padding-left: 1em;
        border-left: 3px solid #dcdfe6;
        color: #606266;
      }

      code {
        background-color: #f5f7fa;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: monospace;
      }

      pre {
        background-color: #f5f7fa;
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;

        code {
          background: none;
          padding: 0;
        }
      }

      img {
        max-width: 100%;
        height: auto;
      }

      a {
        color: #409eff;
        text-decoration: underline;
      }

      hr {
        border: none;
        border-top: 2px solid #dcdfe6;
        margin: 2em 0;
      }
    }
  }
}
</style>
