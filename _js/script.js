import 'mdn-polyfills/Object.entries';
import 'mdn-polyfills/Object.values';
import 'mdn-polyfills/Number.isInteger';
import 'mdn-polyfills/Number.isInteger';
import 'mdn-polyfills/Element.prototype.closest';
import 'mdn-polyfills/Node.prototype.remove';
import '@babel/polyfill/noConflict'; // ie11 support
import helper from './_helper';

export default class chefcookie {
    constructor(config = {}) {
        this.config = config;
        this.alreadyLoadedOnce = [];
        this.isOpened = false;
        if (!('chefcookie_loaded' in window)) {
            window.chefcookie_loaded = [];
        }
    }

    init() {
        if (this.isExcluded()) {
            this.initUpdateOptOutOptInOptIn();
            return;
        }

        if (this.forceAccept()) {
            this.autoAcceptAllScripts();
            this.setCookieToHideOverlay();
        }

        if (this.isCookieSetToHideOverlay()) {
            this.addEnabledScripts(false);
        } else {
            this.autoAcceptBasicScripts();
            this.open();
        }

        this.initUpdateOptOutOptInOptIn();
    }

    open() {
        if (this.isOpened === true) {
            return;
        }
        this.isOpened = true;
        this.addStyle();
        this.buildDom();
        this.addHtmlClasses();
        this.bindButtons();
        this.fixMaxHeight();
    }

    close() {
        if (this.isOpened === false) {
            return;
        }
        this.isOpened = false;
        document.documentElement.classList.remove('chefcookie--visible');
        document.documentElement.classList.remove('chefcookie--fade');
        document.documentElement.classList.remove('chefcookie--noscroll');
        document.documentElement.classList.remove('chefcookie--blur');
        document.querySelector('.chefcookie').classList.add('chefcookie--hidden');
        setTimeout(() => {
            document.querySelector('.chefcookie').remove();
            document.querySelector('.chefcookie-styles').remove();
        }, 500);
    }

    forceAccept() {
        return helper.getParam('accept') === '1';
    }

    initUpdateOptOutOptInOptIn() {
        // legacy: support old attribute names
        if (document.querySelector('[data-disable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-disable]'), el => {
                el.setAttribute('data-cc-disable', el.getAttribute('data-disable'));
            });
        }
        if (document.querySelector('[data-message]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-message]'), el => {
                el.setAttribute('data-cc-message', el.getAttribute('data-message'));
            });
        }

        // init opt out
        if (document.querySelector('[data-cc-disable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-cc-disable]'), el => {
                el.setAttribute('data-cc-message-original', el.textContent);
            });
        }

        // bind opt out
        document.addEventListener('click', e => {
            if (
                e.target.hasAttribute('data-cc-disable') ||
                (e.target.tagName !== 'A' && e.target.closest('[data-cc-disable]'))
            ) {
                let el = e.target.closest('[data-cc-disable]');
                if (!this.isAccepted(el.getAttribute('data-cc-disable'))) {
                    this.accept(el.getAttribute('data-cc-disable'), true);
                } else {
                    this.decline(el.getAttribute('data-cc-disable'), true);
                }
                this.updateOptOutOptIn();
                e.preventDefault();
            }
        });

        // bind opt in
        document.addEventListener('click', e => {
            if (
                e.target.hasAttribute('data-cc-enable') ||
                (e.target.tagName !== 'A' && e.target.closest('[data-cc-enable]'))
            ) {
                let el = e.target.closest('[data-cc-enable]');
                if (!this.isAccepted(el.getAttribute('data-cc-enable'))) {
                    this.accept(el.getAttribute('data-cc-enable'), true);
                }
                this.updateOptOutOptIn();
                e.preventDefault();
            }
        });

        this.updateOptOutOptIn();
    }

    updateOptOutOptIn() {
        // update opt out
        if (document.querySelector('[data-cc-disable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-cc-disable]'), el => {
                if (this.isAccepted(el.getAttribute('data-cc-disable'))) {
                    el.textContent = el.getAttribute('data-cc-message-original');
                    el.classList.remove('disabled');
                } else {
                    el.textContent = el.getAttribute('data-cc-message');
                    el.classList.add('disabled');
                }
            });
        }

        // update opt in
        if (document.querySelector('[data-cc-enable]') !== null) {
            [].forEach.call(document.querySelectorAll('[data-cc-enable]'), el => {
                if (this.isAccepted(el.getAttribute('data-cc-enable'))) {
                    el.remove();
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
        <style class="chefcookie-styles">
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
                color:${this.config.style.color_text ?? '#595f60'};
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
            .chefcookie__message a,
            .chefcookie__message a:focus
            {
                color:inherit;
                transition: all 0.25s ease-in-out;
                text-decoration:underline;
                font-size: 1em;
            }
            .chefcookie__message a:hover
            {
                opacity:0.5;
                color: inherit;
            }
            .chefcookie__message a:active
            {
                opacity:0.1;
                color: inherit;
            }
            .chefcookie__buttons
            {
                margin-top:0.5em;
            }
            .chefcookie__button,
            .chefcookie__button:focus
            {
                padding: 1em 0.5em;
                border: 2px solid ${this.config.style.color_text ?? '#595f60'};
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
                color: inherit;
            }
            .chefcookie__button:active
            {
                opacity:0.1;
                color: inherit;
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
            ${
                this.config.style.highlight_accept === undefined || this.config.style.highlight_accept === true
                    ? `
            .chefcookie__button--accept
            {                
                background-color:${this.config.style.color_highlight ?? this.config.style.color ?? '#ff0000'};
                border-color:transparent;
            }
            .chefcookie__button--accept,
            .chefcookie__button--accept:hover,
            .chefcookie__button--accept:focus
            {
                color:${this.config.style.color_background ?? '#eeeeee'};
            }
                `
                    : ``
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
            .chefcookie__group--disabled .chefcookie__label
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
            .chefcookie__group--disabled .chefcookie__group-checkbox-icon
            {
            ${
                this.config.style.show_disabled_checkbox === undefined ||
                this.config.style.show_disabled_checkbox === false
                    ? `display:none;`
                    : `opacity: 0.5 !important;`
            }
            }
            .chefcookie__group-checkbox-icon
            {
                line-height:2em;
                display: block;
                width: 4em;
                height: 2em;
                background-color: ${this.config.style.color_background ?? '#eeeeee'};
                border: 2px solid ${this.config.style.color_text ?? '#595f60'};
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
                opacity:0.25;
                color: ${this.config.style.color_text ?? '#595f60'};
            }
            .chefcookie__group-checkbox-icon:after
            {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                bottom: 0;
                box-shadow: 0 0 0px 1px ${this.config.style.color_text ?? '#595f60'};
                background-color: ${this.config.style.color_text ?? '#595f60'};
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
                background-color: ${this.config.style.color_text ?? '#595f60'};
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
                background-color: ${this.config.style.color_background ?? '#eeeeee'};
            }
            .chefcookie--overlay .chefcookie__group
            {
                height: 13em;
                margin-bottom: 4%;
                background-color: rgba(${
                    this.config.style.color_background != '' &&
                    ['#000', '#000000', 'black'].indexOf(this.config.style.color_background) > -1
                        ? '255, 255, 255'
                        : '0, 0, 0'
                }, 0.05);
                border: 1px solid rgba(${
                    this.config.style.color_background != '' &&
                    ['#000', '#000000', 'black'].indexOf(this.config.style.color_background) > -1
                        ? '255, 255, 255'
                        : '0, 0, 0'
                }, 0.01);
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
                background-color:${this.config.style.color_background ?? '#eeeeee'};
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
                                        group.cannot_be_modified ? ` chefcookie__group--disabled` : ``
                                    }">                                    
                                        <label class="chefcookie__label" for="chefcookie_group_${i}">
                                            <input${
                                                group.cannot_be_modified ? ` disabled="disabled"` : ``
                                            } class="chefcookie__group-checkbox" id="chefcookie_group_${i}" type="checkbox" name="chefcookie_group[]" value="${i}"${
                                            group.checked_by_default || group.active ? ` checked="checked"` : ``
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
                                this.config.accept_all_if_settings_closed === undefined ||
                                    this.config.accept_all_if_settings_closed === false
                                    ? 'accept'
                                    : 'accept_all'
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
                    this.close();
                    this.setCookieToHideOverlay();
                    this.updateOptOutOptIn();
                    e.preventDefault();
                });
            });
        }
        if (document.querySelector('a[href="#chefcookie__accept"]') !== null) {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__accept"]'), el => {
                el.addEventListener('click', e => {
                    if (
                        !('accept_all_if_settings_closed' in this.config) ||
                        this.config.accept_all_if_settings_closed === true
                    ) {
                        if (!this.settingsVisible()) {
                            this.checkAllOptIns();
                        }
                    }
                    this.saveInCookie();
                    this.addEnabledScripts(true);
                    this.close();
                    this.setCookieToHideOverlay();
                    this.updateOptOutOptIn();
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
        if (this.config.accept_all_if_settings_closed === true) {
            document.querySelector('.chefcookie__button--accept').textContent = this.getLabel('accept');
        }
    }

    switchLabelsClose() {
        document.querySelector('.chefcookie__button--settings').textContent = this.getLabel('settings_open');
        if (this.config.accept_all_if_settings_closed === true) {
            document.querySelector('.chefcookie__button--accept').textContent = this.getLabel('accept_all');
        }
    }

    checkAllOptIns() {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), el => {
            el.checked = true;
        });
    }

    uncheckAllOptIns() {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox:not([disabled])'), el => {
            el.checked = false;
        });
    }

    setCookieToHideOverlay() {
        helper.cookieSet('cc_hide_prompt', '1', this.getCookieExpiration());
    }

    isCookieSetToHideOverlay() {
        return helper.cookieExists('cc_hide_prompt');
    }

    saveInCookie() {
        let providers = [];
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), el => {
            if (el.checked === true) {
                if (this.config.settings[el.value].scripts !== undefined) {
                    Object.entries(this.config.settings[el.value].scripts).forEach(([scripts__key, scripts__value]) => {
                        providers.push(scripts__key);
                    });
                }
            }
        });
        if (providers.length === 0) {
            providers.push('null');
        }
        providers.join(',');
        helper.cookieSet('cc_accepted_providers', providers, this.getCookieExpiration());
    }

    addToCookie(provider) {
        let providers;
        if (!helper.cookieExists('cc_accepted_providers') || helper.cookieGet('cc_accepted_providers') === 'null') {
            providers = [];
        } else {
            providers = helper.cookieGet('cc_accepted_providers').split(',');
        }
        if (providers.indexOf(provider) === -1) {
            providers.push(provider);
            helper.cookieSet('cc_accepted_providers', providers.join(','), this.getCookieExpiration());
        }
    }

    deleteFromCookie(provider) {
        if (!helper.cookieExists('cc_accepted_providers')) {
            return;
        }
        let providers = helper.cookieGet('cc_accepted_providers').split(',');
        let index = providers.indexOf(provider);
        if (index !== -1) {
            providers.splice(index, 1);
        }
        if (providers.length > 0) {
            helper.cookieSet('cc_accepted_providers', providers.join(','), this.getCookieExpiration());
        } else {
            helper.cookieSet('cc_accepted_providers', 'null', this.getCookieExpiration());
        }
    }

    getCookieExpiration() {
        let expiration = 30;
        if ('expiration' in this.config && Number.isInteger(this.config.expiration)) {
            expiration = this.config.expiration;
        }
        return expiration;
    }

    addEnabledScripts(isInit = false) {
        if (!helper.cookieExists('cc_accepted_providers')) {
            return;
        }
        let settings = helper.cookieGet('cc_accepted_providers');
        if (settings == 'null') {
            return;
        }
        settings = settings.split(',');
        this.config.settings.forEach(settings__value => {
            if (settings__value.scripts !== undefined) {
                Object.entries(settings__value.scripts).forEach(([scripts__key, scripts__value]) => {
                    if (settings.indexOf(scripts__key) === -1) {
                        return;
                    }
                    this.load(scripts__key, scripts__value, isInit);
                });
            }
        });
    }

    addScript(provider, isInit = false) {
        if (!helper.cookieExists('cc_accepted_providers')) {
            return;
        }
        let settings = helper.cookieGet('cc_accepted_providers');
        if (settings == 'null') {
            return;
        }
        settings = settings.split(',');
        this.config.settings.forEach(settings__value => {
            if (settings__value.scripts !== undefined) {
                Object.entries(settings__value.scripts).forEach(([scripts__key, scripts__value]) => {
                    if (scripts__key !== provider) {
                        return;
                    }
                    if (settings.indexOf(scripts__key) === -1) {
                        return;
                    }
                    this.load(scripts__key, scripts__value, isInit);
                });
            }
        });
    }

    autoAcceptBasicScripts() {
        this.config.settings.forEach(settings__value => {
            if (settings__value.scripts !== undefined && settings__value.initial_tracking === true) {
                Object.entries(settings__value.scripts).forEach(([scripts__key, scripts__value]) => {
                    this.accept(scripts__key, false);
                });
            }
        });
    }

    autoAcceptAllScripts() {
        let providers = [];
        this.config.settings.forEach(settings__value => {
            if (settings__value.scripts !== undefined) {
                Object.entries(settings__value.scripts).forEach(([scripts__key, scripts__value]) => {
                    this.accept(scripts__key, false);
                });
            }
        });
    }

    load(provider, id, isInit = false) {
        if (this.isLoaded(provider)) {
            return;
        }
        this.setLoaded(provider);
        if (typeof id === 'object' && id !== null) {
            if ('exclude' in id && typeof id.exclude === 'function') {
                if (id.exclude() === true) {
                    return;
                }
            }
            if ('accept' in id && typeof id.accept === 'function') {
                new Promise(resolve => {
                    id.accept(this, resolve, isInit);
                }).then(() => {
                    window.chefcookie_loaded.push(provider);
                });
            }
        } else if (provider === 'analytics' || provider === 'google') {
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
        } else if (provider === 'google_maps') {
            let script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=' + id + '&callback=initMap';
            script.defer = true;
            script.async = true;
            window.initMap = function() {
                window.chefcookie_loaded.push(provider);
            };
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
        }

        this.log('added script ' + provider);
    }

    isAccepted(provider) {
        if (!helper.cookieExists('cc_accepted_providers')) {
            return false;
        }
        return (
            helper
                .cookieGet('cc_accepted_providers')
                .split(',')
                .indexOf(provider) > -1
        );
    }

    isLoaded(provider) {
        return this.alreadyLoadedOnce.indexOf(provider) > -1;
    }

    setLoaded(provider) {
        this.alreadyLoadedOnce.push(provider);
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
        if (typeof gtag != 'function') {
            return;
        }
        if (action === undefined) {
            gtag('event', category);
            this.log('analytics ' + category);
        } else {
            gtag('event', action, { event_category: category });
            this.log('analytics ' + category + ' ' + action);
        }
    }

    eventGoogle(category, action) {
        this.eventAnalytics(category, action);
    }

    eventFacebook(action) {
        if (typeof fbq != 'function') {
            return;
        }
        fbq('trackCustom', action);
        this.log('facebook ' + action);
    }

    eventTwitter(action) {
        if (
            typeof twttr == 'undefined' ||
            typeof twttr.conversion == 'undefined' ||
            typeof twttr.conversion.trackPid != 'function'
        ) {
            return;
        }
        twttr.conversion.trackPid(action);
        this.log('twitter ' + action);
    }

    eventTaboola(event) {
        if (typeof _tfa != 'object') {
            return;
        }
        _tfa.push({ notify: 'event', name: event });
        this.log('taboola ' + event);
    }

    eventMatch2one(id) {
        if (typeof m2o == 'undefined') {
            return;
        }
        let script = document.createElement('script');
        script.src = 'https://secure.adnxs.com/px?' + id + '&t=1';
        document.head.appendChild(script);
        this.log('match2one ' + id);
    }

    eventEtracker(category, action) {
        if (typeof _etracker == 'undefined') {
            return;
        }
        if (action === undefined) {
            _etracker.sendEvent(new et_UserDefinedEvent(null, null, category, null));
            this.log('etracker ' + category);
        } else {
            _etracker.sendEvent(new et_UserDefinedEvent(null, category, action, null));
            this.log('etracker ' + category + ' ' + action);
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
            }, 1000);
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

    url() {
        return window.location.protocol + '//' + window.location.host + window.location.pathname;
    }

    accept(provider, isInit = false) {
        this.addToCookie(provider);
        if (!this.isExcluded()) {
            this.addScript(provider, isInit);
        }
    }

    decline(provider) {
        this.deleteFromCookie(provider);
    }

    log(msg) {
        if (!('debug_log' in this.config) || this.config.debug_log !== true) {
            return;
        }
        console.log(msg);
    }
}

window.chefcookie = chefcookie;
