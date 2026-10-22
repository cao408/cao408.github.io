---
layout: default
title: Yoimiya
---
<div class="hero">
  <div class="term">
    <div class="term-bar"><i></i><i></i><i></i><span>xjtu@micro ~ %</span></div>
    <div class="term-body">
      <div><span class="muted">$ whoami</span></div>
      <div><span class="c">Yoimiya</span> <span class="muted">· 西安交通大学 · 微电子学院</span></div>
      <div><span class="muted">$ cat focus.txt</span></div>
      <div><span class="k">硬件 / 数字 IC 设计</span> <span class="muted">— Hardware &amp; IC Design</span></div>
      <div>&nbsp;</div>
      <div><span class="muted">$ uptime</span> <span class="v">freshman++</span><span class="caret"></span></div>
    </div>
  </div>
  <p class="tagline">
    微电子在读，做硬件。<br>
    想清楚信号从哪里来、到哪里去，再把它们搬进硅片里。
    <span class="en">Microelectronics @ XJTU · signals, logic, silicon.</span>
  </p>
</div>

<section id="about">
  <h2 class="sec-h">about</h2>
  <div class="about-grid">
    <div class="about-card">
      <span class="lab">// LOCATION</span>
      <span class="val">中国 · 西安<small>xi'an, cn</small></span>
    </div>
    <div class="about-card">
      <span class="lab">// FIELD</span>
      <span class="val">微电子 · 数字 IC<small>microelectronics · digital IC</small></span>
    </div>
    <div class="about-card">
      <span class="lab">// NOW</span>
      <span class="val">西交大一，还在被高数与线代追着跑<small>surviving freshman year</small></span>
    </div>
    <div class="about-card">
      <span class="lab">// OFFLINE</span>
      <span class="val">数学、游戏、偶尔写点小工具<small>math · games · side tools</small></span>
    </div>
  </div>
</section>

<section>
  <h2 class="sec-h">stack</h2>
  <div class="chips">
    <span class="chip">C</span>
    <span class="chip">Python</span>
    <span class="chip">Verilog</span>
    <span class="chip">数字电路</span>
    <span class="chip">时序逻辑</span>
    <span class="chip">数学</span>
    <span class="chip">GitHub Pages</span>
  </div>
</section>

<section id="posts">
  <h2 class="sec-h">posts</h2>
  <ul class="plist">
    {% for post in site.posts limit:10 %}
    <li>
      <span class="d">{{ post.date | date: "%Y-%m-%d" }}</span>
      <a class="t" href="{{ post.url }}">{{ post.title }}</a>
      <span class="ar">&rarr;</span>
    </li>
    {% else %}
    <li class="empty">no posts yet <span class="muted">— first one is warming up in the buffer…</span></li>
    {% endfor %}
  </ul>
</section>

<section id="contact">
  <h2 class="sec-h">contact</h2>
  <div class="contact-grid">
    <a class="c-card" href="mailto:Xinzhangheng@stu.xjtu.edu.cn">
      <span class="lab">EMAIL</span>
      <span class="val">Xinzhangheng@stu.xjtu.edu.cn</span>
    </a>
    <a class="c-card" href="https://github.com/cao408" target="_blank" rel="noopener">
      <span class="lab">GITHUB</span>
      <span class="val">github.com/cao408</span>
    </a>
    <a class="c-card" href="https://x.com/cao1234562022" target="_blank" rel="noopener">
      <span class="lab">X / TWITTER</span>
      <span class="val">@cao1234562022</span>
    </a>
    <a class="c-card" href="https://search.bilibili.com/all?keyword=%E5%B9%B4%E8%BD%BB%E4%BA%BA%E4%B8%8D%E8%AE%B2%E6%AD%A6%E5%BE%B7emm" target="_blank" rel="noopener">
      <span class="lab">BILIBILI</span>
      <span class="val">@年轻人不讲武德emm</span>
    </a>
  </div>
</section>
