var initGiscus = function () {
    var path = window.location.pathname;
    if (path.endsWith("/print.html")) {
        return;
    }

    document.getElementById("theme-list").addEventListener("click", function (e) {
        console.log("hi");
        var iframe = document.querySelector('.giscus-frame');
        if (!iframe) {
            return;
        }

        var themeName;
        if (e.target.className === "theme") {
            themeName = e.target.id;
            console.log(themeName);
        } else {
            return;
        }
        console.log(themeName);

        var theme;
        if (themeName != "light" && themeName != "rust") {
            theme = "transparent_dark";
        } else {
            theme = "light";
        }
        console.log(theme);

        var msg = {
            setConfig: {
                theme: theme
            }
        };
        iframe.contentWindow.postMessage({ giscus: msg }, 'https://giscus.app');
    });

    var theme;
    const themeClass = document.getElementsByTagName("html")[0].className;
    if (themeClass.indexOf("light") == -1 && themeClass.indexOf("rust") == -1) {
        theme = "transparent_dark";
    } else {
        theme = "light";
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "ShenMian/sokoban-tutorial");
    script.setAttribute("data-repo-id", "R_kgDOLaAVUw");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "DIC_kwDOLaAVU84CeEvG");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    document.getElementById("giscus-container").appendChild(script);
};

window.addEventListener('load', initGiscus);