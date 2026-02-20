  (function() {
    const savedTheme = localStorage.getItem('selectedColorTheme') || "standard";
    const isTheoryweb = window.location.pathname.startsWith("/theoryweb");
    
    let theme = savedTheme === "cep" ? "standard"
      : savedTheme === "standard" ? (isTheoryweb ? "fnaf" : "standard")
      : savedTheme;

    // Apply seasonal override
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const eventSetting = localStorage.getItem('eventThemeSetting') || "auto";
    if (eventSetting === "auto") {
      if (month === 10) theme = "halloween";
      else if (month === 6 || month === 7) theme = "pride";
      else if (month === 5 && date === 17) theme = "anniversary";
      else if (month === 12) theme = "winter";
    }

    if (theme !== "standard") {
      document.documentElement.setAttribute("data-theme", theme);
    }

    const savedWidth = localStorage.getItem('pageWidth') || "default";
    if (savedWidth !== "default") {
      document.documentElement.setAttribute("data-width", savedWidth);
    }
  })();
