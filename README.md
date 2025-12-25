# 小红书纯净版 / Xiaohongshu Focus

> 让小红书网页端回归纯净，专注搜索与内容  
> Block distractions on Xiaohongshu (Rednote) Web, focus on what matters.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kcpdiafbdnphkbkpaplphnlfkknojfdo?label=Chrome%20Web%20Store)](链接待更新)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文](#chinese)

---

<a name="chinese"></a>
##  简介

小红书纯净版是一个轻量级 Chrome 扩展，帮助你过滤小红书上的干扰内容，打造更专注的浏览体验。

## 功能特性

-  **主页推荐流屏蔽** - 隐藏首页和探索页的推荐内容，避免「一打开就忘记自己要搜什么」。
-  **"猜你想搜"屏蔽** - 隐藏搜索页的推荐搜索词，不被热点吸引注意力。
-  **通知小红点隐藏** - 隐藏消息通知的红点提示，减少社交焦虑。
-  **通知入口隐藏** - 完全隐藏消息通知入口，完全杜绝数据焦虑。
-  **页面图片屏蔽** - 隐藏所有图片，极简阅读体验。

所有功能都可以在控制面板中独立开关。

## 安装

### 从 Chrome 应用商店安装（推荐）
[点击这里安装](链接待更新)

### 从源码安装
1. 下载本项目：
```bash
   git clone https://github.com/LuceTu/xiaohongshu-focus.git
```
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目文件夹

## 使用方法

1. 安装后，点击浏览器工具栏的插件图标
2. 在弹出的控制面板中，根据需要开启/关闭各项功能
3. 刷新小红书页面，即可看到效果

## 技术栈

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage API

## 更新日志

### v1.0.0 (2025-12-25 🎄)
-  首个正式版本发布
-  新增控制面板，支持独立控制各项功能
-  新增「猜你想搜」屏蔽功能
-  新增通知小红点隐藏功能
-  新增通知入口隐藏功能
-  新增页面图片屏蔽功能
-  修复用户主页被误隐藏的问题
-  性能优化：优化屏蔽速度，降低性能需求。

### v0.1 (2024-12-23 🎄)
-  初始版本，基础 Feed 流屏蔽功能

##  贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

##  开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

##  联系方式

- Email: ishidev@hotmail.com.
- GitHub Issues: [提交问题](https://github.com/LuceTu/xiaohongshu-focus/issues)

##  支持项目

如果这个项目对你有帮助，欢迎：
-  Star 本项目
-  报告 Bug 或提出建议
-  [请我喝杯一点点](ko-fi.com/ishidev)

---

<a name="english"></a>
##  Introduction

Xiaohongshu Focus is a lightweight Chrome extension that helps you filter distracting content on Xiaohongshu (RedNote) Web, creating a more focused browsing experience.

##  Features

-  **Feed Blocker** - Hide homepage and explore page recommendations
-  **Search Suggestions Blocker** - Hide "You might search for" suggestions
-  **Notification Badge Hider** - Remove notification red dots 
-  **Notification Entry Hider** - Completely hide notification button 
-  **Image Blocker** - Hide all images for minimal reading experience

All features can be toggled independently in the control panel.

##  Installation

### From Chrome Web Store (Recommended)
[Click here to install](link pending)

### From Source
1. Clone this repository:
```bash
   git clone https://github.com/LuceTu/xiaohongshu-focus.git
```
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the project folder

##  Usage

1. After installation, click the extension icon in the browser toolbar
2. Toggle features on/off in the popup panel
3. Refresh Xiaohongshu page to see the effects

##  Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage API

##  Changelog

### v1.0.0 (2025-12-25 🎄)
-  First official release
-  Added control panel for independent feature toggles
-  Added search suggestions blocker
-  Added notification badge hider
-  Added notification entry hider
-  Added image blocker
-  Fixed user profile page being incorrectly hidden
-  Performance optimization: event-driven instead of polling,optimize blocking speed and reduce performance demands 

### v0.1 (2024-12-23 🎄)
-  Initial release with basic feed blocking

##  Contributing

Issues and Pull Requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the [MIT License](LICENSE).

##  Contact

- Email: ishidev@hotmail.com.
- GitHub Issues: [Submit an issue](https://github.com/LuceTu/xiaohongshu-focus/issues)

##  Support

If this project helps you, please consider:
-  Star this repository
-  Report bugs or suggest features
-  [Buy me a bagal](https://ko-fi.com/ishidev) 

