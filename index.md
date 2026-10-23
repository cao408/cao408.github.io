---
layout: default
title: Yoimiya
---
<div class="hero">
  <div class="term">
    <div class="term-bar"><i></i><i></i><i></i><span>xjtu@micro ~ %</span></div>
    <div class="term-body">
      <div><span class="muted">$ whoami</span></div>
      <div><span class="c">Yoimiya</span></div>
      <div><span class="muted">2023-2026&nbsp;&nbsp;</span>Mianyang high school, Sichuan</div>
      <div><span class="muted">2026-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>school of microelectronics, XJTU</div>
      <div><span class="muted">$ cat focus.txt</span></div>
      <div><span class="k">想做 SNN</span></div>
      <div>&nbsp;</div>
      <div><span class="muted">$ uptime</span> <span class="v">freshman++</span><span class="caret"></span></div>
    </div>
  </div>
  <p class="tagline">
    First year of microelectronics at XJTU.
    <span class="en">微电子在读，想做 SNN。目前被线代和数分追着杀。</span>
  </p>
</div>

<section id="about">
  <h2 class="sec-h">about</h2>
  <div class="about-grid">
    <div class="about-card">
      <span class="lab">// LOCATION</span>
      <span class="val">西安，陕西<small>Xi'an, Shaanxi</small></span>
    </div>
    <div class="about-card">
      <span class="lab">// FIELD</span>
      <span class="val">微电子，还没搞懂 SNN<small>microelectronics, still lost in SNN</small></span>
    </div>
    <div class="about-card">
      <span class="lab">// NOW</span>
      <span class="val">活着，作业还没写完<small>alive, homework pending</small></span>
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

<section id="projects">
  <h2 class="sec-h">projects</h2>
  <ul class="plist">
    <li>
      <span class="d">闲着弄的</span>
      <a class="t" href="https://cao408.github.io/xiqian-1956-/" target="_blank" rel="noopener">《西迁·1956》</a>
      <span class="ar">&rarr;</span>
    </li>
  </ul>
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
    <li class="empty">还没有文章，再等等吧 <span class="muted">— no posts yet</span></li>
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
    <a class="c-card" href="https://space.bilibili.com/1231365047" target="_blank" rel="noopener">
      <span class="lab">BILIBILI</span>
      <span class="val">@年轻人不讲武德emm</span>
    </a>
  </div>
</section>
