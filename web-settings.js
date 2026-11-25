(() => {
    const messages = {
        en: {
            settings: 'Settings',
            language: 'Website language',
            install: 'Install app',
            help: 'Use your browser’s Install app or Add to Home Screen option. On iPhone or iPad, open Share in Safari and choose Add to Home Screen.',
        },
        'zh-Hant': {
            settings: '設定',
            language: '網頁語言',
            install: '安裝應用程式',
            help: '請使用瀏覽器的「安裝應用程式」或「加入主畫面」功能。若使用 iPhone 或 iPad，請在 Safari 開啟分享選單，再選擇「加入主畫面」。',
        },
        'zh-Hans': {
            settings: '设置',
            language: '网页语言',
            install: '安装应用',
            help: '请使用浏览器的“安装应用”或“添加到主屏幕”功能。如果使用 iPhone 或 iPad，请打开 Safari 的分享菜单，然后选择“添加到主屏幕”。',
        },
    };

    const controls = document.getElementById('web-settings');
    const toggle = document.getElementById('settings-toggle');
    const panel = document.getElementById('settings-panel');
    const language = document.getElementById('web-language');
    const label = document.getElementById('language-label');
    const install = document.getElementById('install-app');
    const help = document.getElementById('install-help');
    const storageKey = 'mcpeweb.language';
    let installPrompt;

    function browserLanguage() {
        const locale = navigator.language.toLowerCase();
        if (/^zh-(hant|tw|hk|mo)(-|$)/.test(locale)) return 'zh-Hant';
        if (/^zh(-|$)/.test(locale)) return 'zh-Hans';
        return 'en';
    }

    function applyLanguage(locale) {
        const copy = messages[locale];
        document.documentElement.lang = locale;
        language.value = locale;
        toggle.textContent = copy.settings;
        label.textContent = copy.language;
        install.textContent = copy.install;
        help.textContent = copy.help;
    }

    let savedLanguage;
    try {
        savedLanguage = localStorage.getItem(storageKey);
    } catch {
        // Language switching remains available when storage is blocked.
    }
    applyLanguage(Object.hasOwn(messages, savedLanguage) ? savedLanguage : browserLanguage());

    language.addEventListener('change', () => {
        applyLanguage(language.value);
        try {
            localStorage.setItem(storageKey, language.value);
        } catch {
            // Keep the language for the current page.
        }
    });

    function setPanelOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => setPanelOpen(panel.hidden));
    controls.addEventListener('keydown', event => {
        event.stopPropagation();
        if (event.key === 'Escape' && !panel.hidden) {
            event.preventDefault();
            setPanelOpen(false);
            toggle.focus();
        }
    });
    controls.addEventListener('keyup', event => event.stopPropagation());

    function showInstallHelp(show) {
        help.hidden = !show;
        install.setAttribute('aria-expanded', String(show));
    }

    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        installPrompt = event;
        showInstallHelp(false);
    });

    function hideInstallButton() {
        installPrompt = undefined;
        showInstallHelp(false);
        if (document.activeElement === install) language.focus();
        install.hidden = true;
    }

    const standalone = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)');
    if (standalone.matches || navigator.standalone) hideInstallButton();
    window.addEventListener('appinstalled', hideInstallButton);

    install.addEventListener('click', async () => {
        if (!installPrompt) {
            showInstallHelp(help.hidden);
            return;
        }

        const prompt = installPrompt;
        installPrompt = undefined;
        install.disabled = true;
        try {
            const choice = await prompt.prompt();
            if (choice.outcome === 'accepted') hideInstallButton();
        } catch {
            showInstallHelp(true);
        } finally {
            install.disabled = false;
        }
    });
})();
