import * as sanitizeHtml from 'sanitize-html';

/**
 * 富文本内容安全配置
 * 允许常用的 HTML 标签和属性，过滤危险内容
 */
const sanitizeOptions: sanitizeHtml.IOptions = {
  // 允许的标签
  allowedTags: [
    // 文本格式
    'p', 'br', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
    'sub', 'sup', 'mark', 'small',
    // 列表
    'ul', 'ol', 'li',
    // 链接和媒体
    'a', 'img', 'video', 'audio', 'source',
    // 嵌入内容
    'iframe',
    // 表格
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // 引用和代码
    'blockquote', 'pre', 'code',
    // 其他
    'hr', 'figure', 'figcaption',
  ],

  // 允许的属性
  allowedAttributes: {
    '*': ['class', 'id', 'style'],
    'a': ['href', 'target', 'rel', 'title'],
    'img': ['src', 'alt', 'width', 'height', 'loading'],
    'video': ['src', 'controls', 'width', 'height', 'poster', 'autoplay', 'muted', 'loop'],
    'audio': ['src', 'controls'],
    'source': ['src', 'type'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan', 'scope'],
    'code': ['class'], // 用于代码高亮
  },

  // 允许的 URL 协议
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],

  // 允许的 URL 协议（针对 src 属性）
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
    video: ['http', 'https'],
    audio: ['http', 'https'],
    iframe: ['http', 'https'],
  },

  // 允许的 CSS 属性
  allowedStyles: {
    '*': {
      'color': [/.*/],
      'background-color': [/.*/],
      'font-size': [/.*/],
      'font-weight': [/.*/],
      'font-style': [/.*/],
      'text-align': [/.*/],
      'text-decoration': [/.*/],
      'line-height': [/.*/],
      'margin': [/.*/],
      'margin-top': [/.*/],
      'margin-bottom': [/.*/],
      'margin-left': [/.*/],
      'margin-right': [/.*/],
      'padding': [/.*/],
      'padding-top': [/.*/],
      'padding-bottom': [/.*/],
      'padding-left': [/.*/],
      'padding-right': [/.*/],
      'width': [/.*/],
      'height': [/.*/],
      'max-width': [/.*/],
      'max-height': [/.*/],
    },
  },

  // 转换标签
  transformTags: {
    'a': (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer', // 安全：防止 window.opener 攻击
        },
      };
    },
  },

  // 过滤空标签
  exclusiveFilter: (frame) => {
    // 保留 br、hr、img 等自闭合标签
    const selfClosingTags = ['br', 'hr', 'img', 'source'];
    if (selfClosingTags.includes(frame.tag)) {
      return false;
    }
    // 过滤内容为空的标签
    return !frame.text?.trim() && !frame.mediaChildren?.length;
  },
};

/**
 * 清洗 HTML 内容，防止 XSS 攻击
 */
export function sanitizeContent(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  return sanitizeHtml(html, sanitizeOptions);
}

/**
 * 清洗富文本内容对象
 * 支持 JSON 格式的富文本（如 TipTap、Quill 等编辑器的输出）
 */
export function sanitizeRichContent(content: any): any {
  if (!content) {
    return content;
  }

  // 如果是字符串（HTML），直接清洗
  if (typeof content === 'string') {
    return sanitizeContent(content);
  }

  // 如果是对象（如 TipTap JSON），递归清洗 text 和 content 字段
  if (typeof content === 'object') {
    return sanitizeJsonContent(content);
  }

  return content;
}

/**
 * 递归清洗 JSON 格式的富文本内容
 */
function sanitizeJsonContent(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJsonContent(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === 'text' && typeof value === 'string') {
        // 对文本内容进行转义
        result[key] = escapeHtml(value);
      } else if (key === 'content' && typeof value === 'string') {
        // 对 HTML 内容进行清洗
        result[key] = sanitizeContent(value);
      } else if (typeof value === 'object') {
        result[key] = sanitizeJsonContent(value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
}

/**
 * HTML 转义（用于纯文本）
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

