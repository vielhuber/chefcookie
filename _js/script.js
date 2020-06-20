import 'mdn-polyfills/Object.entries';
import 'mdn-polyfills/Object.values';
import 'mdn-polyfills/Number.isInteger';
import 'mdn-polyfills/Number.isInteger';
import Promise from 'promise-polyfill';
import helper from './_helper';

export default class chefcookie {
    constructor(config = {}) {
        this.config = config;
        if (!('chefcookie_loaded' in window)) {
            window.chefcookie_loaded = [];
        }
    }

    init() {
        if (this.forceAccept()) {
            this.addAllProvidersToCookie();
        }

        this.initOptOut();

        if (this.isExcluded()) {
            return;
        }

        if (this.cookieExists()) {
            this.addEnabledScripts();
        } else {
            this.addStyle();
            this.buildDom();
            this.addHtmlClasses();
            this.bindButtons();
            this.fixMaxHeight();
            if (this.config.initial_tracking === true) {
                this.addAllScripts();
            }
        }
    }

    forceAccept() {
        return helper.getParam('accept') === '1';
    }

    initOptOut() {
        if (document.querySelector('[data-disable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-disable]'), el => {
                el.setAttribute('data-message-original', el.textContent);
                if (!this.isEnabled(el.getAttribute('data-disable'))) {
                    el.textContent = el.getAttribute('data-message');
                } else {
                    el.textContent = el.getAttribute('data-message-original');
                }
                el.addEventListener('click', e => {
                    if (!this.isEnabled(el.getAttribute('data-disable'))) {
                        e.currentTarget.textContent = e.currentTarget.getAttribute('data-message-original');
                        this.addToCookie(e.currentTarget.getAttribute('data-disable'));
                    } else {
                        e.currentTarget.textContent = e.currentTarget.getAttribute('data-message');
                        this.deleteFromCookie(e.currentTarget.getAttribute('data-disable'));
                    }
                    e.preventDefault();
                });
            });
        }
    }

    updateOptOut() {
        if (document.querySelector('[data-disable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-disable]'), el => {
                if (!this.isEnabled(el.getAttribute('data-disable'))) {
                    el.textContent = el.getAttribute('data-message');
                } else {
                    el.textContent = el.getAttribute('data-message-original');
                }
            });
        }
    }

    isExcluded() {
        if (this.config.exclude === undefined) {
            return false;
        }
        let excluded = false;
        this.config.exclude.forEach(exclude__value => {
            if (typeof exclude__value === 'function' && exclude__value() === true) {
                excluded = true;
            }
            if (
                typeof exclude__value === 'string' &&
                ((exclude__value.indexOf('http') === 0 &&
                    exclude__value ===
                        window.location.protocol + '//' + window.location.host + window.location.pathname) ||
                    (exclude__value.indexOf('http') !== 0 && exclude__value === window.location.pathname) ||
                    (exclude__value.indexOf('http') !== 0 && exclude__value + '/' === window.location.pathname))
            ) {
                excluded = true;
            }
        });
        return excluded;
    }

    addStyle() {
        document.head.insertAdjacentHTML(
            'beforeend',
            `
        <style>
            .chefcookie, .chefcookie *
            {
                box-sizing: border-box;
                margin:0;
                padding:0;
            }
            .chefcookie
            {
                position: fixed;
                z-index: 2147483647;
                left: 0;
                right: 0;
                bottom: 0;
                transform: translateZ(0);
                transition: opacity 0.25s ease-in-out;                
            }
            .chefcookie--hidden
            {
                opacity:0;
                pointer-events:none;
            }
            .chefcookie--hidden .chefcookie__box
            {
                transform: scale(0.8);
            }
            .chefcookie__inner
            {
                width:100%;
                height:100%;
                text-align: center;
                white-space: nowrap;
                font-size: 0;
                overflow-y:auto;
                max-height:100vh;
            }
            .chefcookie__box
            {
                font-size: ${15 + (this.config.style.size - 3)}px;
                color:#595f60;
                line-height:1.6;
                width: 100%;
                margin: 0 auto;
                display: inline-block;
                vertical-align: middle;
                white-space: normal;
                border-radius: 0;
                padding-top: 2em;
                padding-bottom: 2em;
                padding-left: 3em;
                padding-right: 3em;
                text-align: left;
                transition: transform 0.25s ease-in-out;
            }
            .chefcookie__message
            {
                margin-bottom:1em;
                text-align:justify;
            }
            .chefcookie__message h2
            {
                margin-bottom:0.5em;
                font-size:2em;
                text-transform:uppercase;
                font-weight:700;
                text-align:left;
            }
            .chefcookie__message p {
                font-size: 1em;
            }
            .chefcookie__message a
            {
                color:inherit;
                transition: all 0.25s ease-in-out;
                text-decoration:underline;
                font-size: 1em;
            }
            .chefcookie__message a:hover
            {
                opacity:0.5;
            }
            .chefcookie__message a:active
            {
                opacity:0.1;
            }
            .chefcookie__buttons
            {
                margin-top:0.5em;
            }
            .chefcookie__button
            {
                padding: 1em 0.5em;
                border: 2px solid #595f60;
                font-weight: bold;
                display: block;
                color: inherit;
                text-decoration: none;
                transition: all 0.25s ease-in-out;
                text-transform: uppercase;
                float: left;
                min-width: 21em;
                text-align: center;
            }
            .chefcookie__button:hover
            {
                opacity:0.5;
                text-decoration:none;
            }
            .chefcookie__button:active
            {
                opacity:0.1;
            }
            .chefcookie__buttons:after
            {            
                clear:both;
                display:table;
                content:"";
            }
            .chefcookie__button--settings
            {
                margin-right:3em;
            }
            .chefcookie__button--accept
            {
                background-color:${this.config.style.color};
                border-color:transparent;
                color:#fff;
            }
            .chefcookie__settings-container
            {
                height:0;
                overflow:hidden;
                transition: height 0.1s ease-out;
            }
            .chefcookie__groups
            {
                list-style-type:none;
            }
            .chefcookie__groups:after
            {
                clear:both;
                display:table;
                content:"";
            }
            .chefcookie__group
            {
                float: left;
            }
            .chefcookie__group-title
            {
                float:left;
                width:70%;
                height: 1.66em;
                line-height: 1.66em;
                display: block;
                font-weight:bold;
                font-size:1.2em;
                text-transform:uppercase;
            }
            .chefcookie__label
            {
                cursor: pointer;
                display:block;
                width:100%;
                height:100%;
            }
            .chefcookie__group--hidden .chefcookie__label
            {
                cursor:default;
            }
            .chefcookie__group-checkbox
            {
                opacity: 0;
                position:absolute;
                display: block;
                pointer-events:none;
            }
            .chefcookie__group--hidden .chefcookie__group-checkbox-icon
            {
                display:none;
            }
            .chefcookie__group-checkbox-icon
            {
                line-height:2em;
                display: block;
                width: 4em;
                height: 2em;
                background-color: #fff;
                border: 2px solid #595f60;
                margin: 0;
                padding: 0;
                position: relative;
                border-radius: 2em;
                float: right;
            }
            .chefcookie__group-checkbox-icon:before
            {
                content: "0";
                position: absolute;
                top: 0;
                left: 45%;
                width: 50%;
                bottom: 0;
                transition: all 0.15s ease-in-out;
                text-align: center;
                font-weight: bold;
                color: #595f60;
            }
            .chefcookie__group-checkbox-icon:after
            {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                bottom: 0;
                box-shadow: 0 0 0px 1px #595f60;
                background-color: #595f60;
                transition: all 0.15s ease-in-out;
                border-radius: 50%;
            }
            .chefcookie__group-checkbox ~ *
            {
                opacity:0.5;
                transition: all 0.25s ease-in-out;
            }
            .chefcookie__group-checkbox:checked ~ *
            {
                opacity:1;
            }
            .chefcookie__group-checkbox:checked ~ .chefcookie__group-checkbox-icon:after
            {
                left:50%;
            }
            .chefcookie__group-checkbox:checked ~ .chefcookie__group-checkbox-icon:before
            {
                content: "";
                background-color: #595f60;
                top: 30%;
                bottom: 30%;
                left: 27%;
                width: 3px;
            }
            .chefcookie__group-description
            {
                width:100%;
                clear:both;
                padding-top:1em;
                display: block;
                font-size:0.9em;
                text-align:justify;
            }
            .chefcookie--noscroll
            {
                position:fixed;
                width: 100%;
                overflow:hidden;
            }
            .chefcookie--fade body:after
            {
                content:"";
                position:fixed;
                z-index: 2147483644;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background-color: rgba(0, 0, 0, 0.65);
            }
            .chefcookie--blur .chefcookie ~ *
            {
                filter: grayscale(50%) blur(5px);
                -webkit-filter: grayscale(50%) blur(5px);
            }
            .chefcookie--overlay
            {
                top: 0;
            }
            .chefcookie--overlay .chefcookie__inner:before
            {
                content: '';
                display: inline-block;
                height: 100%;
                vertical-align: middle;
            }
            .chefcookie--overlay .chefcookie__box
            {
                max-width: 60em;
                box-shadow: 0 1em 5em -0.5em #000;
                background-color: #fff;
            }
            .chefcookie--overlay .chefcookie__group
            {
                height: 13em;
                margin-bottom: 4%;
                background-color: #f7f7f7;
                border: 1px solid #eee;
                width: 48%;
                margin-right: 4%;
            }
            .chefcookie--overlay .chefcookie__group:nth-child(2n)
            {
                margin-right:0;
            }
            .chefcookie--overlay .chefcookie__label
            {
                padding: 1em 1.25em;
            }
            .chefcookie--bottombar
            {
                top: auto;
                background-color:#eeeeee;
                box-shadow: 0 1em 5em -0.5em #000;
            }
            .chefcookie--bottombar .chefcookie__box
            {
                max-width: 1280px;
            }
            .chefcookie--bottombar .chefcookie__group
            {
                margin-bottom: 40px;
                margin-top: 40px;
                width: 22%;
                margin-right: 4%;
            }
            .chefcookie--bottombar .chefcookie__group:last-child
            {
                margin-right:0;
            }
            .chefcookie--bottombar .chefcookie__groups--count-9 .chefcookie__group { width: 7.55%; }
            .chefcookie--bottombar .chefcookie__groups--count-8 .chefcookie__group { width: 9.00%; }
            .chefcookie--bottombar .chefcookie__groups--count-7 .chefcookie__group { width: 10.85%; }
            .chefcookie--bottombar .chefcookie__groups--count-6 .chefcookie__group { width: 13.33%; }
            .chefcookie--bottombar .chefcookie__groups--count-5 .chefcookie__group { width: 16.80%; }
            .chefcookie--bottombar .chefcookie__groups--count-4 .chefcookie__group { width: 22.00%; }
            .chefcookie--bottombar .chefcookie__groups--count-3 .chefcookie__group { width: 30.66%; }
            .chefcookie--bottombar .chefcookie__groups--count-2 .chefcookie__group { width: 48%; }
            .chefcookie--bottombar .chefcookie__groups--count-1 .chefcookie__group { width: 100%; }
            @media screen and (max-width: 840px)
            {
                .chefcookie__box
                {
                    padding:1em;
                }
                .chefcookie__message h2
                {
                    font-size:1.5em;
                }
                .chefcookie__button
                {
                    float: none;
                    margin: 0 0 1em;
                    text-align: center;
                    width: 100%;
                    min-width:0;
                }
                .chefcookie .chefcookie__group,
                .chefcookie--overlay .chefcookie__group,
                .chefcookie--bottombar .chefcookie__group
                {
                    float:none;
                    margin-right:0;
                    width:100%;
                    height:auto;
                }
            }
        </style>
        `
        );
    }

    addHtmlClasses() {
        document.documentElement.classList.add('chefcookie--visible');
        if (this.config.style.noscroll == true) {
            document.documentElement.classList.add('chefcookie--noscroll');
        }
        if (this.config.style.fade == true) {
            document.documentElement.classList.add('chefcookie--fade');
        }
        if (this.config.style.blur == true) {
            document.documentElement.classList.add('chefcookie--blur');
        }
    }

    buildDom() {
        document.body.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="chefcookie chefcookie--${this.config.style.layout}">
                <div class="chefcookie__inner">
                    <div class="chefcookie__box">
                        <div class="chefcookie__message">${this.translate(this.config.message)}</div>
                        <div class="chefcookie__settings-container">
                            <ul class="chefcookie__groups chefcookie__groups--count-${this.config.settings.length}">
                                ${this.config.settings
                                    .map(
                                        (group, i) => `
                                    <li class="chefcookie__group${
                                        group.hidden ? ` chefcookie__group--hidden` : ``
                                    }">                                    
                                        <label class="chefcookie__label" for="chefcookie_group_${i}">
                                            <input${
                                                group.hidden ? ` disabled="disabled"` : ``
                                            } class="chefcookie__group-checkbox" id="chefcookie_group_${i}" type="checkbox" name="chefcookie_group[]" value="${i}"${
                                            group.active ? ` checked="checked"` : ``
                                        } />
                                            <span class="chefcookie__group-title">${this.translate(group.title)}</span>
                                            <span class="chefcookie__group-checkbox-icon"></span>                                                                                  
                                            <span class="chefcookie__group-description">${this.translate(
                                                group.description
                                            )}</span>
                                        </label>
                                    </li>
                                `
                                    )
                                    .join('')}
                            </ul>
                        </div>
                        <div class="chefcookie__buttons">
                            <a href="#chefcookie__settings" class="chefcookie__button chefcookie__button--settings">${this.getLabel(
                                'settings_open'
                            )}</a>
                            <a href="#chefcookie__accept" class="chefcookie__button chefcookie__button--accept">${this.getLabel(
                                'accept'
                            )}</a>
                        </div>
                    </div>
                </div>
            </div>
        `
        );
    }

    getLabel(label) {
        if (this.config.labels[label] === undefined) {
            return '';
        }
        return this.translate(this.config.labels[label]);
    }

    bindButtons() {
        if (document.querySelector('a[href="#chefcookie__decline"]') !== null) {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__decline"]'), el => {
                el.addEventListener('click', e => {
                    this.uncheckAllOptIns();
                    this.saveInCookie();
                    this.hideOverlay();
                    this.updateOptOut();
                    e.preventDefault();
                });
            });
        }
        if (document.querySelector('a[href="#chefcookie__accept"]') !== null) {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__accept"]'), el => {
                el.addEventListener('click', e => {
                    if (!this.settingsVisible()) {
                        this.checkAllOptIns();
                    }
                    this.saveInCookie();
                    if (!('initial_tracking' in this.config) || this.config.initial_tracking !== true) {
                        this.addEnabledScripts();
                    }
                    this.hideOverlay();
                    this.updateOptOut();
                    e.preventDefault();
                });
            });
        }
        if (document.querySelector('a[href="#chefcookie__settings"]') !== null) {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__settings"]'), el => {
                el.addEventListener('click', e => {
                    if (!this.settingsVisible()) {
                        this.showSettings();
                        this.switchLabelsOpen();
                    } else {
                        this.hideSettings();
                        this.switchLabelsClose();
                    }
                    e.preventDefault();
                });
            });
        }
    }

    switchLabelsOpen() {
        document.querySelector('.chefcookie__button--settings').textContent = this.getLabel('settings_close');
    }

    switchLabelsClose() {
        document.querySelector('.chefcookie__button--settings').textContent = this.getLabel('settings_open');
    }

    checkAllOptIns() {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), el => {
            el.checked = true;
        });
    }

    uncheckAllOptIns() {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), el => {
            el.checked = false;
        });
    }

    cookieExists() {
        return helper.cookieExists('chefcookie');
    }

    saveInCookie() {
        let providers = [];
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), el => {
            if (el.checked === true) {
                if (this.config.settings[el.value].trackers !== undefined) {
                    Object.entries(this.config.settings[el.value].trackers).forEach(
                        ([trackers__key, trackers__value]) => {
                            providers.push(trackers__key);
                        }
                    );
                }
            }
        });
        if (providers.length === 0) {
            providers.push('null');
        }
        providers.join(',');
        helper.cookieSet('chefcookie', providers, this.getCookieExpiration());
    }

    addToCookie(provider) {
        let providers;
        if (!helper.cookieExists('chefcookie') || helper.cookieGet('chefcookie') === 'null') {
            providers = [];
        } else {
            providers = helper.cookieGet('chefcookie').split(',');
        }
        if (providers.indexOf(provider) === -1) {
            providers.push(provider);
            helper.cookieSet('chefcookie', providers.join(','), this.getCookieExpiration());
        }
    }

    deleteFromCookie(provider) {
        if (!helper.cookieExists('chefcookie')) {
            return;
        }
        let providers = helper.cookieGet('chefcookie').split(',');
        let index = providers.indexOf(provider);
        if (index !== -1) {
            providers.splice(index, 1);
        }
        if (providers.length > 0) {
            helper.cookieSet('chefcookie', providers.join(','), this.getCookieExpiration());
        } else {
            helper.cookieSet('chefcookie', 'null', this.getCookieExpiration());
        }
    }

    getCookieExpiration() {
        let expiration = 30;
        if ('expiration' in this.config && Number.isInteger(this.config.expiration)) {
            expiration = this.config.expiration;
        }
        return expiration;
    }

    addEnabledScripts() {
        if (!helper.cookieExists('chefcookie')) {
            return;
        }
        let settings = helper.cookieGet('chefcookie');
        if (settings == 'null') {
            return;
        }
        settings = settings.split(',');
        this.config.settings.forEach(settings__value => {
            if (settings__value.trackers !== undefined) {
                Object.entries(settings__value.trackers).forEach(([trackers__key, trackers__value]) => {
                    if (settings.indexOf(trackers__key) === -1) {
                        return;
                    }
                    this.addScript(trackers__key, trackers__value);
                });
            }
        });
    }

    addAllScripts() {
        this.config.settings.forEach(settings__value => {
            if (settings__value.trackers !== undefined) {
                Object.entries(settings__value.trackers).forEach(([trackers__key, trackers__value]) => {
                    this.addScript(trackers__key, trackers__value);
                });
            }
        });
    }

    addAllProvidersToCookie() {
        let providers = [];
        this.config.settings.forEach(settings__value => {
            if (settings__value.trackers !== undefined) {
                Object.entries(settings__value.trackers).forEach(([trackers__key, trackers__value]) => {
                    providers.push(trackers__key);
                });
            }
        });
        providers.join(',');
        helper.cookieSet('chefcookie', providers, this.getCookieExpiration());
    }

    addScript(provider, id) {
        if (provider === 'analytics' || provider === 'google') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
            document.head.appendChild(script);
            script = document.createElement('script');
            script.innerHTML =
                "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '" +
                id +
                "'); gtag('config', '" +
                id +
                "', { 'anonymize_ip': true });";
            document.head.appendChild(script);
        } else if (provider === 'tagmanager') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            let html = '';
            html +=
                "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N667H38');";
            // this is not part of the default tagmanager code, because events are tracked via "dataLayer" or directly inside tag manager
            // we make this also available here
            html += 'function gtag(){dataLayer.push(arguments);}';
            script.innerHTML = html;
            document.head.appendChild(script);
        } else if (provider === 'facebook') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.innerHTML =
                "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '" +
                id +
                "');fbq('track', 'PageView');fbq('track', 'ViewContent');";
            document.head.appendChild(script);
        } else if (provider === 'twitter') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.src = '//platform.twitter.com/oct.js';
            document.head.appendChild(script);
        } else if (provider === 'taboola') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.innerHTML =
                "window._tfa = window._tfa || [];window._tfa.push({notify: 'event', name: 'page_view'});!function (t, f, a, x) { if (!document.getElementById(x)) { t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f); } }(document.createElement('script'), document.getElementsByTagName('script')[0], '//cdn.taboola.com/libtrc/unip/" +
                id +
                "/tfa.js', 'tb_tfa_script');";
            document.head.appendChild(script);
        } else if (provider === 'match2one') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.src = 'https://secure.adnxs.com/seg?add=' + id + '&t=1';
            document.head.appendChild(script);
            script = document.createElement('script');
            script.innerHTML = 'window.m2o = true;';
            document.head.appendChild(script);
        } else if (provider === 'smartlook') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.innerHTML =
                "window.smartlook||(function(d) {var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='https://rec.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init', '" +
                id +
                "');";
            document.head.appendChild(script);
        } else if (provider === 'etracker') {
            let script = document.createElement('script');
            script.onload = () => {
                window.chefcookie_loaded.push(provider);
            };
            script.id = '_etLoader';
            script.type = 'text/javascript';
            script.charset = 'UTF-8';
            script.setAttribute('data-respect-dnt', 'true');
            script.setAttribute('data-secure-code', id);
            script.src = '//static.etracker.com/code/e.js';
            document.head.appendChild(script);
        } else if (typeof id === 'function') {
            new Promise(resolve => {
                id(resolve, this.loadJs);
            }).then(() => {
                window.chefcookie_loaded.push(provider);
            });
        }

        console.log('added script ' + provider);
    }

    isEnabled(provider) {
        if (!helper.cookieExists('chefcookie')) {
            return false;
        }
        return (
            helper
                .cookieGet('chefcookie')
                .split(',')
                .indexOf(provider) > -1
        );
    }

    hideOverlay() {
        document.documentElement.classList.remove('chefcookie--visible');
        document.documentElement.classList.remove('chefcookie--fade');
        document.documentElement.classList.remove('chefcookie--noscroll');
        document.documentElement.classList.remove('chefcookie--blur');
        document.querySelector('.chefcookie').classList.add('chefcookie--hidden');
        setTimeout(() => {
            document.body.removeChild(document.querySelector('.chefcookie'));
        }, 2000);
    }

    settingsVisible() {
        return document
            .querySelector('.chefcookie__settings-container')
            .classList.contains('chefcookie__settings-container--visible');
    }

    showSettings() {
        document
            .querySelector('.chefcookie__settings-container')
            .classList.add('chefcookie__settings-container--visible');
        document.querySelector('.chefcookie__settings-container').style.height =
            document.querySelector('.chefcookie__settings-container').scrollHeight + 'px';
        this.fixMaxHeight();
    }

    hideSettings() {
        document
            .querySelector('.chefcookie__settings-container')
            .classList.remove('chefcookie__settings-container--visible');
        document.querySelector('.chefcookie__settings-container').style.height = 0;
    }

    fixMaxHeight() {
        document.querySelector('.chefcookie__inner').style.maxHeight = window.innerHeight + 'px';
    }

    eventAnalytics(category, action) {
        if (!this.isEnabled('analytics') && !this.isEnabled('tagmanager')) {
            return;
        }
        if (typeof gtag != 'function') {
            return;
        }
        if (action === undefined) {
            gtag('event', category);
            console.log('analytics ' + category);
        } else {
            gtag('event', action, { event_category: category });
            console.log('analytics ' + category + ' ' + action);
        }
    }

    eventGoogle(category, action) {
        this.eventAnalytics(category, action);
    }

    eventFacebook(action) {
        if (!this.isEnabled('facebook')) {
            return;
        }
        if (typeof fbq != 'function') {
            return;
        }
        fbq('trackCustom', action);
        console.log('facebook ' + action);
    }

    eventTwitter(action) {
        if (!this.isEnabled('twitter')) {
            return;
        }
        if (
            typeof twttr == 'undefined' ||
            typeof twttr.conversion == 'undefined' ||
            typeof twttr.conversion.trackPid != 'function'
        ) {
            return;
        }
        twttr.conversion.trackPid(action);
        console.log('twitter ' + action);
    }

    eventTaboola(event) {
        if (!this.isEnabled('taboola')) {
            return;
        }
        if (typeof _tfa != 'object') {
            return;
        }
        _tfa.push({ notify: 'event', name: event });
        console.log('taboola ' + event);
    }

    eventMatch2one(id) {
        if (!this.isEnabled('match2one')) {
            return;
        }
        if (typeof m2o == 'undefined') {
            return;
        }
        let script = document.createElement('script');
        script.src = 'https://secure.adnxs.com/px?' + id + '&t=1';
        document.head.appendChild(script);
        console.log('match2one ' + id);
    }

    eventEtracker(category, action) {
        if (!this.isEnabled('etracker')) {
            return;
        }
        if (typeof _etracker == 'undefined') {
            return;
        }
        if (action === undefined) {
            _etracker.sendEvent(new et_UserDefinedEvent(null, null, category, null));
            console.log('etracker ' + category);
        } else {
            _etracker.sendEvent(new et_UserDefinedEvent(null, category, action, null));
            console.log('etracker ' + category + ' ' + action);
        }
    }

    trackDuration() {
        var _this = this,
            timer = 30;
        while (timer / 60 <= 8) {
            (function(timer) {
                window.setTimeout(function() {
                    _this.eventAnalytics('duration_time', timer + 's');
                    _this.eventEtracker('duration_time', timer + 's');
                }, timer * 1000);
            })(timer);
            timer += 30;
        }
    }

    trackDurationCustom(timer, callback) {
        setTimeout(callback, timer * 1000);
    }

    trackScrollDepth() {
        var scrollDepthTriggered = {
            1: false,
            10: false,
            25: false,
            50: false,
            75: false,
            100: false
        };
        this.eventAnalytics('scroll_depth', '0%');
        this.eventEtracker('scroll_depth', '0%');
        window.addEventListener('scroll', () => {
            let scroll = this.scrollPos();
            for (var scrollDepthTriggered__key in scrollDepthTriggered) {
                if (scrollDepthTriggered[scrollDepthTriggered__key] === false && scroll >= scrollDepthTriggered__key) {
                    scrollDepthTriggered[scrollDepthTriggered__key] = true;
                    this.eventAnalytics('scroll_depth', scrollDepthTriggered__key + '%');
                    this.eventEtracker('scroll_depth', scrollDepthTriggered__key + '%');
                }
            }
        });
    }

    trackScrollDepthCustom(percent, callback) {
        var scrollDepthTriggered = false;
        window.addEventListener('scroll', () => {
            let scroll = this.scrollPos();
            if (scrollDepthTriggered === false && scroll >= percent) {
                scrollDepthTriggered = true;
                callback();
            }
        });
    }

    scrollPos() {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
            documentHeight = Math.max(
                document.body.offsetHeight,
                document.body.scrollHeight,
                document.documentElement.clientHeight,
                document.documentElement.offsetHeight,
                document.documentElement.scrollHeight
            ),
            windowHeight = window.innerHeight,
            scroll = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        return scroll;
    }

    waitFor(provider, callback = null) {
        return new Promise((resolve, reject) => {
            let timeout = setInterval(() => {
                if ('chefcookie_loaded' in window && window.chefcookie_loaded.indexOf(provider) > -1) {
                    window.clearInterval(timeout);
                    if (callback !== null && typeof callback === 'function') {
                        callback();
                    }
                    resolve();
                }
            }, 30);
        });
    }

    loadJs(urls, callback = null) {
        if (typeof urls === 'string' || urls instanceof String) {
            urls = [urls];
        }
        let promises = [];
        urls.forEach(urls__value => {
            promises.push(
                new Promise((resolve, reject) => {
                    let script = document.createElement('script');
                    script.src = urls__value;
                    script.onload = () => {
                        resolve();
                    };
                    document.head.appendChild(script);
                })
            );
        });
        if (callback !== null && typeof callback === 'function') {
            Promise.all(promises).then(() => {
                callback();
            });
        } else {
            return Promise.all(promises);
        }
    }

    translate(obj) {
        if (typeof obj === 'string' || obj instanceof String) {
            return obj;
        }
        let lng = this.lng();
        if (!(lng in obj)) {
            return Object.values(obj)[0];
        }
        return obj[lng];
    }

    lng() {
        let lng = 'en';
        if (document.documentElement.hasAttribute('lang')) {
            lng = document.documentElement
                .getAttribute('lang')
                .substring(0, 2)
                .toLowerCase();
        }
        return lng;
    }
}

window.chefcookie = chefcookie;
