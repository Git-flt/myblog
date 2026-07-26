#!/usr/bin/env node
/**
 * 新建文章草稿
 *
 *   npm run new -- "文章标题"                    # 默认 topic: aiops-x-ai，草稿状态
 *   npm run new -- "文章标题" --topic architecture
 *   npm run new -- "文章标题" --slug my-slug
 *
 * 生成的 frontmatter 与 src/content.config.ts 的 schema 对齐，
 * 避免再出现旧站那种缺 date、tags 格式不一致的问题。
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const TOPICS = ['aiops-x-ai', 'architecture', 'trends', 'notes'];
const POSTS_DIR = 'src/content/posts';

const args = process.argv.slice(2);
const flags = {};
const positional = [];

for (let i = 0; i < args.length; i += 1) {
  if (args[i].startsWith('--')) {
    flags[args[i].slice(2)] = args[i + 1];
    i += 1;
  } else {
    positional.push(args[i]);
  }
}

const title = positional.join(' ').trim();
if (!title) {
  console.error('用法：npm run new -- "文章标题" [--topic aiops-x-ai] [--slug my-slug]');
  process.exit(1);
}

const topic = flags.topic ?? 'aiops-x-ai';
if (!TOPICS.includes(topic)) {
  console.error(`未知 topic：${topic}\n可选：${TOPICS.join(' / ')}`);
  process.exit(1);
}

// 文件名优先用 --slug；否则中文标题直接作文件名（URL 支持中文，旧站已有先例）
const slug = flags.slug ?? title.replace(/\s+/g, '-');
const date = new Date().toISOString().slice(0, 10);
const filePath = join(POSTS_DIR, `${slug}.md`);

if (existsSync(filePath)) {
  console.error(`文件已存在：${filePath}`);
  process.exit(1);
}

mkdirSync(POSTS_DIR, { recursive: true });

const template = `---
title: ${title}
date: ${date}
tags: []
excerpt: 一句话摘要，会出现在首页卡片、RSS 与 llms.txt 中。
topic: ${topic}
category:
draft: true
---

## 背景

<!--
写作前自检：
1. 这篇文章 ChatGPT 能不能写出八成？能的话换个角度或者别写。
2. 里面的技术方案我自己跑通了吗？没跑通的部分要明确标注为推演。
3. 有没有只有我能提供的一手经验（生产事故、真实数据、踩过的坑）？
-->

## 正文

## 小结
`;

writeFileSync(filePath, template, 'utf8');

console.log(`✓ 已创建 ${filePath}`);
console.log(`  topic: ${topic}｜日期: ${date}｜当前为 draft，改成 draft: false 才会发布`);
console.log('  预览：npm run dev');
