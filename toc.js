// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">介绍</a></li><li class="chapter-item expanded "><a href="design.html"><strong aria-hidden="true">1.</strong> 设计 🚧</a></li><li class="chapter-item expanded "><a href="level/index.html"><strong aria-hidden="true">2.</strong> 关卡</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="level/representation.html"><strong aria-hidden="true">2.1.</strong> 表示</a></li><li class="chapter-item expanded "><a href="level/construction.html"><strong aria-hidden="true">2.2.</strong> 构造</a></li><li class="chapter-item expanded "><a href="level/normalization.html"><strong aria-hidden="true">2.3.</strong> 标准化 🚧</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">3.</strong> 动作</div></li><li class="chapter-item expanded "><a href="solver/index.html"><strong aria-hidden="true">4.</strong> 求解器 🚧</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="solver/solving_strategy.html"><strong aria-hidden="true">4.1.</strong> 搜索策略 🚧</a></li><li class="chapter-item expanded "><a href="solver/heuristic_function.html"><strong aria-hidden="true">4.2.</strong> 启发式函数 🚧</a></li><li class="chapter-item expanded "><a href="solver/optimization.html"><strong aria-hidden="true">4.3.</strong> 优化</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="solver/tunnels.html"><strong aria-hidden="true">4.3.1.</strong> 隧道</a></li><li class="chapter-item expanded "><a href="solver/deadlocks.html"><strong aria-hidden="true">4.3.2.</strong> 死锁 🚧</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.3.3.</strong> 割点</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.4.</strong> 双向搜索</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.5.</strong> 特征</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.</strong> 优化器</div></li><li class="chapter-item expanded "><a href="resources.html"><strong aria-hidden="true">6.</strong> 资源</a></li><li class="chapter-item expanded "><a href="glossary_of_terms.html"><strong aria-hidden="true">7.</strong> 术语表</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
