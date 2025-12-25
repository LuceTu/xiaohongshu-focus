/**
 * contentScript.js  / Unified Content Script
 *
 * Update Strategy:
 * - 在 document_start 时立即注入 CSS，避免内容闪现
 * - At document_start, inject CSS immediately to prevent content flash
 * - CSS 比 JS DOM 操作更早生效，内容从一开始就被隐藏
 * - CSS takes effect earlier than JS DOM manipulation, content is hidden from the start
 */

'use strict';

// ========== 第一步：立即注入初始CSS（防闪现）==========
// Step 1: Immediately inject initial CSS (prevent flash)
// 这段代码在脚本加载时立即执行，不等待任何东西
// This code executes immediately when script loads, doesn't wait for anything

(function injectInitialCSS() {
  const path = window.location.pathname;

  // 判断是否是需要隐藏Feed的页面 / Check if this page needs Feed hidden
  const isHomePage = path === '/' || path === '/explore' || path.startsWith('/explore?');
  const isExcluded = path.includes('/search_result') || path.startsWith('/user') || /^\/explore\/[0-9a-fA-F]{16,}/.test(path);
  const needsHideFeed = isHomePage && !isExcluded;

  if (needsHideFeed) {
    // 创建样式元素 / Create style element
    const style = document.createElement('style');
    style.id = 'xhs-blocker-initial-style';
    style.textContent = `
      /* 立即隐藏Feed - 防止闪现 / Immediately hide Feed - prevent flash */
      .feeds-container,
      .reds-sticky-box,
      .channel-container {
        display: none !important;
      }
    `;

    // 尽可能早地插入样式 / Insert style as early as possible
    const target = document.head || document.documentElement;
    if (target) {
      target.appendChild(style);
    }

    console.log('[Xiaohongshu Focus] 初始隐藏CSS已注入 / Initial hiding CSS injected');
  }
})();


// ========== 配置 / Configuration ==========

const DEFAULT_SETTINGS = {
  hideFeed: true,               // 主页推荐内容隐藏 / Hide feed
  hideSearchSuggest: true,      // 「猜你想搜」隐藏 / Hide search suggestions
  hideNotificationBadge: true,  // 通知小红点隐藏 / Hide notification badge
  hideNotificationEntry: false, // 通知入口隐藏 / Hide notification button
  hideImages: false             // 页面图片隐藏 / Hide all images
};

// 样式元素的ID / Style element IDs
const STYLE_IDS = {
  feed: 'xhs-blocker-feed-style',
  searchSuggest: 'xhs-blocker-search-suggest-style',
  notificationBadge: 'xhs-blocker-notification-badge-style',
  notificationEntry: 'xhs-blocker-notification-entry-style',
  images: 'xhs-blocker-image-style'
};

// ========== 全局状态 / Global State ==========

let currentSettings = { ...DEFAULT_SETTINGS };
let lastURL = window.location.href;


// ========== 工具函数 / Utility Functions ==========

/**
 * 判断当前页面是否需要隐藏Feed / Check if current page needs Feed hidden
 */
function shouldHideFeed() {
  const path = window.location.pathname;

  // 排除页面 / Excluded pages
  if (path.includes('/search_result')) return false;
  if (path.startsWith('/user')) return false;
  if (/^\/explore\/[0-9a-fA-F]{16,}/.test(path)) return false;

  // 需要隐藏的页面 / Pages that need hiding
  if (path === '/' || path === '/explore' || path.startsWith('/explore?')) return true;

  return false;
}

/**
 * 注入或移除CSS样式 / Inject or remove CSS style
 * @param {string} id - 样式元素ID
 * @param {string} css - CSS内容
 * @param {boolean} shouldInject - 是否注入
 */
function manageStyle(id, css, shouldInject) {
  let style = document.getElementById(id);

  if (shouldInject) {
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
      console.log(`[Xiaohongshu Focus] 样式已注入 / Style injected: ${id}`);
    }
  } else {
    if (style) {
      style.remove();
      console.log(`[Xiaohongshu Focus] 样式已移除 / Style removed: ${id}`);
    }
  }
}


// ========== 五个功能的处理函数 / Five Feature Handlers ==========

/**
 * 1. Feed流隐藏 / Feed Hiding
 */
function handleFeedVisibility() {
  // 移除初始样式 / Remove initial style
  const initialStyle = document.getElementById('xhs-blocker-initial-style');
  if (initialStyle) initialStyle.remove();

  const shouldHide = currentSettings.hideFeed && shouldHideFeed();

  const css = `
    .feeds-container,
    .reds-sticky-box,
    .channel-container {
      display: none !important;
    }
  `;

  manageStyle(STYLE_IDS.feed, css, shouldHide);
}

/**
 * 2. "猜你想搜"隐藏 / Search Suggestions Hiding
 * 选择器：.sug-box 是猜你想搜的容器
 * Selector: .sug-box is the container for search suggestions
 */
function handleSearchSuggestVisibility() {
  const shouldHide = currentSettings.hideSearchSuggest;

  const css = `
    /* 猜你想搜容器 / Search suggestions container */
    .sug-box {
      display: none !important;
    }
  `;

  manageStyle(STYLE_IDS.searchSuggest, css, shouldHide);
}

/**
 * 3. 通知小红点隐藏 / Notification Badge Hiding
 * 选择器：.count 是显示未读数量的徽章
 * Selector: .count is the badge showing unread count
 * 只隐藏数字，不影响图标 / Only hide the count, not the icon
 */
function handleNotificationBadgeVisibility() {
  const shouldHide = currentSettings.hideNotificationBadge;

  const css = `
    /* 通知数字徽章隐藏 / Notification count badge hiding */
    .badge-container .count,
    .count {
      display: none !important;
    }
  `;

  manageStyle(STYLE_IDS.notificationBadge, css, shouldHide);
}

/**
 * 4. 通知入口隐藏 / Notification Entry Hiding
 * 选择器：a[href="/notification"] 是通知入口链接
 * Selector: a[href="/notification"] is the notification entry link
 * 使用 visibility 保持占位，避免布局跳动
 * Use visibility to maintain space, avoid layout shift
 */
function handleNotificationEntryVisibility() {
  const shouldHide = currentSettings.hideNotificationEntry;

  const css = `
    /* 通知入口隐藏 - 保持占位 / Notification entry hiding - maintain space */
    a[href="/notification"],
    a[title="通知"] {
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  manageStyle(STYLE_IDS.notificationEntry, css, shouldHide);
}

/**
 * 5. 图片屏蔽 / Image Blocking
 */
function handleImageVisibility() {
  const shouldHide = currentSettings.hideImages;

  const css = `
    img,
    video,
    [class*="cover"]:not(.cover-container),
    [style*="background-image"] {
      visibility: hidden !important;
    }
  `;

  manageStyle(STYLE_IDS.images, css, shouldHide);
}


// ========== 主控制函数 / Main Control Functions ==========

/**
 * 应用所有设置 / Apply all settings
 */
function applyAllSettings() {
  console.log('[Xiaohongshu Focus] 应用设置 / Applying settings:', currentSettings);
  console.log('[Xiaohongshu Focus] 当前路径 / Current path:', window.location.pathname);

  handleFeedVisibility();
  handleSearchSuggestVisibility();
  handleNotificationBadgeVisibility();
  handleNotificationEntryVisibility();
  handleImageVisibility();
}

/**
 * 处理URL变化 / Handle URL change
 */
function handleURLChange() {
  const currentURL = window.location.href;
  if (currentURL !== lastURL) {
    console.log(`[Xiaohongshu Focus] URL变化 / URL changed`);
    lastURL = currentURL;
    applyAllSettings();
  }
}


// ========== 设置和事件监听 / Settings & Event Listeners ==========

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      if (chrome.runtime.lastError) {
        console.error('[Xiao hong shu] 加载设置失败 / Failed to load settings');
        resolve(DEFAULT_SETTINGS);
        return;
      }
      currentSettings = { ...result };
      console.log('[Xiaohongshu Focus] 设置已加载 / Settings loaded:', currentSettings);
      resolve(currentSettings);
    });
  });
}

function setupStorageListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key in currentSettings) {
        currentSettings[key] = newValue;
      }
    }
    applyAllSettings();
  });
}

function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'SETTING_CHANGED') {
      if (message.key in currentSettings) {
        currentSettings[message.key] = message.value;
      }
      applyAllSettings();
      sendResponse({ success: true });
    }
    return true;
  });
}

function setupURLListeners() {
  // 监听浏览器前进/后退 / Listen for browser back/forward
  window.addEventListener('popstate', handleURLChange);

  // 劫持 pushState / Hijack pushState
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    handleURLChange();
  };

  // 劫持 replaceState / Hijack replaceState
  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    handleURLChange();
  };

  // 备用方案：定时检测URL变化（每500ms）
  // Fallback: periodic URL check (every 500ms)
  // 某些SPA框架可能绕过pushState，这个保证不会漏掉
  // Some SPA frameworks may bypass pushState, this ensures nothing is missed
  setInterval(handleURLChange, 500);
}


// ========== 初始化 / Initialization ==========

async function initialize() {
  console.log('[Xiaohongshu Focus] =====================================');
  console.log('[Xiaohongshu Focus] 脚本初始化 / Initializing');
  console.log('[Xiaohongshu Focus] URL:', window.location.href);
  console.log('[Xiaohongshu Focus] =====================================');

  await loadSettings();

  setupStorageListener();
  setupMessageListener();
  setupURLListeners();

  // 根据页面加载状态应用设置 / Apply settings based on page load state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllSettings);
  } else {
    applyAllSettings();
  }

  // 页面完全加载后再应用一次 / Apply again after full load
  window.addEventListener('load', () => setTimeout(applyAllSettings, 100));
}

initialize();
