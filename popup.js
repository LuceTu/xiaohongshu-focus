/**
 * popup.js - Dashboard逻辑控制 / Dashboard Logic Controller
 *
 * 功能说明 / Description:
 * - 管理5个功能开关的状态 / Manages the state of 5 feature toggles
 * - 使用chrome.storage.sync持久化设置 / Uses chrome.storage.sync for persistent settings
 * - 实时通知content script更新状态 / Real-time notification to content script for state updates
 *
 * 存储键名说明 / Storage Key Names:
 * - hideFeed: 主页Feed流屏蔽 / Home feed blocking
 * - hideSearchSuggest: 搜索页"猜你想搜"屏蔽 / Search suggestions blocking
 * - hideNotificationBadge: 通知小红点隐藏 / Notification badge hiding
 * - hideNotificationEntry: 通知入口完全隐藏 / Notification entry hiding
 * - hideImages: 屏蔽所有图片 / Block all images
 */

'use strict';

// ========== 配置常量 / Configuration Constants ==========

/**
 * 默认设置值 / Default Settings Values
 * 定义每个功能的默认开关状态
 * Defines the default toggle state for each feature
 */
const DEFAULT_SETTINGS = {
  hideFeed: true,              // 主页推荐内容隐藏 / Hide feed
  hideSearchSuggest: true,     // 「猜你想搜」隐藏 / Hide search suggestions
  hideNotificationBadge: true, // 通知小红点隐藏 / Hide notification badge
  hideNotificationEntry: false, // 通知入口隐藏 / Hide notification button
  hideImages: false             // 页面图片隐藏 / Hide all images
};

/**
 * 开关ID与存储键的映射关系 / Toggle ID to Storage Key Mapping
 * 用于关联HTML元素与存储键名
 * Associates HTML elements with storage key names
 */
const TOGGLE_MAPPING = {
  'toggle-feed': 'hideFeed',
  'toggle-search-suggest': 'hideSearchSuggest',
  'toggle-notification-badge': 'hideNotificationBadge',
  'toggle-notification-entry': 'hideNotificationEntry',
  'toggle-images': 'hideImages'
};

// ========== 初始化函数 / Initialization Functions ==========

/**
 * 初始化popup界面 / Initialize Popup Interface
 * 在DOM加载完成后执行
 * Executes after DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Xiaohongshu Focus] Popup初始化中... / Popup initializing...');

  try {
    // 加载已保存的设置 / Load saved settings
    await loadSettings();

    // 为每个开关绑定事件监听器 / Bind event listeners to each toggle
    bindToggleListeners();

    console.log('[Xiaohongshu Focus] Popup初始化完成 / Popup initialization complete');
  } catch (error) {
    console.error('[Xiaohongshu Focus] Popup初始化失败 / Popup initialization failed:', error);
  }
});

// ========== 设置管理函数 / Settings Management Functions ==========

/**
 * 从chrome.storage.sync加载设置 / Load Settings from chrome.storage.sync
 * 将存储的设置应用到界面开关上
 * Applies stored settings to interface toggles
 */
async function loadSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      if (chrome.runtime.lastError) {
        console.error('[Xiaohongshu Focus] 加载设置失败 / Failed to load settings:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }

      console.log('[Xiaohongshu Focus] 已加载设置 / Settings loaded:', result);

      // 将设置应用到对应的开关上 / Apply settings to corresponding toggles
      for (const [toggleId, storageKey] of Object.entries(TOGGLE_MAPPING)) {
        const toggleElement = document.getElementById(toggleId);
        if (toggleElement) {
          toggleElement.checked = result[storageKey];
        }
      }

      resolve(result);
    });
  });
}

/**
 * 保存单个设置项 / Save a Single Setting
 * @param {string} key - 存储键名 / Storage key name
 * @param {boolean} value - 设置值 / Setting value
 */
async function saveSetting(key, value) {
  return new Promise((resolve, reject) => {
    const data = { [key]: value };

    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error(`[Xiaohongshu Focus] 保存设置失败 / Failed to save setting [${key}]:`, chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }

      console.log(`[Xiaohongshu Focus] 设置已保存 / Setting saved: ${key} = ${value}`);
      resolve();
    });
  });
}

// ========== 事件处理函数 / Event Handler Functions ==========

/**
 * 为所有开关绑定change事件监听器 / Bind Change Event Listeners to All Toggles
 * 当用户切换开关时，保存设置并通知content script
 * When user toggles a switch, saves settings and notifies content script
 */
function bindToggleListeners() {
  for (const [toggleId, storageKey] of Object.entries(TOGGLE_MAPPING)) {
    const toggleElement = document.getElementById(toggleId);

    if (toggleElement) {
      toggleElement.addEventListener('change', async (event) => {
        const isChecked = event.target.checked;

        console.log(`[Xiaohongshu Focus] 开关状态变更 / Toggle state changed: ${storageKey} = ${isChecked}`);

        try {
          // 保存设置到storage / Save setting to storage
          await saveSetting(storageKey, isChecked);

          // 通知当前活动标签页的content script / Notify content script in current active tab
          await notifyContentScript(storageKey, isChecked);
        } catch (error) {
          console.error(`[Xiaohongshu Focus] 处理开关变更失败 / Failed to handle toggle change:`, error);

          // 回滚开关状态 / Rollback toggle state
          event.target.checked = !isChecked;
        }
      });
    } else {
      console.warn(`[Xiaohongshu Focus] 未找到开关元素 / Toggle element not found: ${toggleId}`);
    }
  }
}

/**
 * 通知content script设置已更新 / Notify Content Script of Settings Update
 * @param {string} key - 更新的设置键名 / Updated setting key
 * @param {boolean} value - 新的设置值 / New setting value
 */
async function notifyContentScript(key, value) {
  try {
    // 获取当前活动标签页 / Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.id && tab.url && tab.url.includes('xiaohongshu.com')) {
      // 向content script发送消息 / Send message to content script
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SETTING_CHANGED',
        key: key,
        value: value
      });

      console.log(`[Xiaohongshu Focus] 已通知content script / Content script notified: ${key} = ${value}`);
    }
  } catch (error) {
    // content script可能未加载，这是正常情况 / Content script may not be loaded, which is normal
    console.log('[Xiaohongshu Focus] 无法通知content script（页面可能未加载）/ Cannot notify content script (page may not be loaded)');
  }
}
