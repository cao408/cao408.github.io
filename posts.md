---
layout: default
title: posts
---
<section>
  <h2 class="sec-h">posts</h2>
  <ul class="plist">
    {% for post in site.posts %}
    <li>
      <span class="d">{{ post.date | date: "%Y-%m-%d" }}</span>
      <a class="t" href="{{ post.url }}">{{ post.title }}</a>
      <span class="ar">&rarr;</span>
    </li>
    {% else %}
    <li class="empty">no posts yet <span class="muted">— writing soon.</span></li>
    {% endfor %}
  </ul>
</section>
