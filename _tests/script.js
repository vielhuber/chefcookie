let options = {
    message: {
        de: '\
            <h2>Wir verwenden Cookies</h2>\
            <p>\
                Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Akzeptieren</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/de/datenschutz">Datenschutzerklärung</a> sowie im <a href="/de/impressum">Impressum</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.\
            </p>\
        ',
        en: '\
            <h2>We use cookies</h2>\
            <p>\
                Our website uses cookies that help us to improve our website, provide the best possible service and enable an optimal customer experience. <a href="#chefcookie__settings">Here</a> you can manage your settings. By clicking on "<a href="#chefcookie__accept">Accept</a>", you agree that your cookies may be used for this purpose. You can find further information on this in our <a href="/en/privacy">data protection declaration</a> and in the <a href="/en/imprint">imprint</a>. If you do not agree to this, you can refuse the use of cookies here <a href="#chefcookie__decline">reject</a> the use of cookies.\
            </p>\
        '
    },
    accept_all_if_settings_closed: true,
    show_decline_button: true,
    scripts_selection: 'collapse',
    debug_log: true,
    consent_tracking: '/track-consent.php',
    expiration: 1,
    cookie_prefix: 'iddqd_',
    exclude_google_pagespeed: true,
    style: {
        layout: 'overlay',
        size: 3,
        color_text: '#eee',
        color_highlight: 'blue',
        color_background: '#000',
        highlight_accept: true,
        show_disabled_checkbox: true,
        noscroll: true,
        fade: true,
        blur: true,
        css_replace: ``,
        css_add: `.chefcookie { opacity:0.5; }`
    },
    labels: {
        accept: { de: 'Akzeptieren', en: 'Accept' },
        accept_all: { de: 'Alles akzeptieren', en: 'Accept all' },
        settings_open: { de: 'Einstellungen festlegen', en: 'Change settings' },
        settings_close: { de: 'Einstellungen schliessen', en: 'Close settings' },
        group_open: { de: 'Weitere Informationen anzeigen', en: 'Show more information' },
        group_close: { de: 'Weitere Informationen schliessen', en: 'Close more information' },
        decline: { de: 'Nur erforderliche Cookies', en: 'Only necessary cookies' },
        details_open: { de: 'Details anzeigen', en: 'Show details' },
        details_close: { de: 'Details schliessen', en: 'Close details' }
    },
    exclude: ['/de/datenschutz', '/en/privacy', '/de/impressum', '/en/imprint'],
    settings: [
        {
            title: { de: 'Analysen', en: 'Analyses' },
            description: {
                de: 'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
                en: 'Tools that collect anonymous data about website usage and functionality. We use this information to improve our products, services and user experience.'
            },
            checked_by_default: false,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {
                analytics: 'UA-xxxxxxxx-1',
                matomo: 'tld.com#1',
                google_maps_iframe: {
                    accept: function (cc, resolve, isInit) {
                        if (document.querySelector('iframe[alt-src*="google.com/maps"]') !== null) {
                            [].forEach.call(
                                document.querySelectorAll('iframe[alt-src*="google.com/maps"]'),
                                function (el) {
                                    el.setAttribute('src', el.getAttribute('alt-src'));
                                }
                            );
                            resolve();
                        }
                    }
                },
                google_recaptcha: {
                    accept: function (cc, resolve, isInit) {
                        window.captchaCallback = function () {
                            [].forEach.call(document.querySelectorAll('.recaptcha'), function (el) {
                                var holderId = grecaptcha.render(el, {
                                    sitekey: 'XXX',
                                    badge: 'inline',
                                    type: 'image',
                                    size: 'invisible',
                                    callback: function (token) {
                                        HTMLFormElement.prototype.submit.call(el.closest('form'));
                                    }
                                });
                                el.closest('form').onsubmit = function (e) {
                                    e.preventDefault();
                                    grecaptcha.execute(holderId);
                                };
                            });
                            resolve();
                        };
                        cc.loadJs('https://www.google.com/recaptcha/api.js?onload=captchaCallback&amp;render=explicit');
                        if (isInit === true) {
                            console.log('google recaptcha initially loaded');
                        }
                    }
                }
            }
        },
        {
            title: { de: 'Werbung', en: 'Advertising' },
            description: {
                de: 'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
                en: 'Anonymous information that we collect in order to recommend useful products and services to you.'
            },
            checked_by_default: true,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {
                tagmanager: 'GTM-xxxxxxx',
                facebook: { id: 'xxxxxxxxxxxxxxx' },
                twitter: {
                    id: 'single',
                    title: { de: 'Google Analytics_DE', en: 'Google Analytics_EN' },
                    description: {
                        de: 'Die Verwendung der Analyse Cookies erfolgt zu dem Zweck, die Qualität unserer Website und ihre Inhalte zu verbessern und die Funktionsfähigkeit von eingebundenen Diensten unserer Partner sicherzustellen.',
                        en: '\
                            <p>\
                                Google Analytics cookies are used to improve the quality of our website and its content and to ensure the functionality of integrated services of our partners.\
                            </p>\
                            <table>\
                                <tr><td>Name:</td><td>_gid</td></tr>\
                                <tr><td>Host:</td><td>www.tld.com</td></tr>\
                                <tr><td>Duration:</td><td>Session</td></tr>\
                                <tr><td>Type:</td><td>1st Party</td></tr>\
                                <tr><td>Description:</td><td>This is a pattern type cookie name associated with a marketing cloud. It stores an unique visitor identifier, and uses an organisation identifier.</td></tr>\
                            </table>\
                        '
                    }
                },
                taboola: 'xxxxxxx',
                match2one: 'xxxxxxxx',
                linkedin: 'xxxxxxx',
                smartlook: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                crazyegg: 'xxxx/xxxx',
                google_maps: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        },
        {
            title: { de: 'Drittanbieter', en: 'Third-party' },
            checked_by_default: false,
            cannot_be_modified: false,
            initial_tracking: false
        },
        {
            title: { de: 'Grundlegendes', en: 'Basics' },
            description: {
                de: 'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
                en: 'Tools that enable essential services and functions, including identity verification, service continuity, and site security. This option cannot be declined.'
            },
            checked_by_default: true,
            cannot_be_modified: true,
            initial_tracking: false,
            scripts: {
                etracker_custom: {
                    accept: function (cc, resolve, isInit) {
                        cc.load('etracker', 'xxxxxx');
                        resolve();
                    }
                },
                test_custom: {}
            }
        }
    ]
};
let cc = null;
document.addEventListener('DOMContentLoaded', function () {
    cc = new chefcookie(options);
    cc.init();
    cc.waitFor('google_recaptcha', function () {
        console.log('google_recaptcha fully loaded');
    });
    document.querySelector('.manual').innerText = 'Akzeptieren/Ablehnen';
    document.querySelector('.manual').addEventListener('click', function (e) {
        if (cc.isAccepted('analytics')) {
            cc.decline('analytics');
            e.currentTarget.innerText = 'Akzeptieren';
        } else {
            cc.accept('analytics');
            e.currentTarget.innerText = 'Ablehnen';
        }
        e.preventDefault();
    });
    document.querySelector('.open').addEventListener('click', function (e) {
        cc.open();
        e.preventDefault();
    });
    document.querySelector('.destroy').addEventListener('click', function (e) {
        cc.destroy();
        e.preventDefault();
    });
    window.setInterval(function () {
        let cookies = document.cookie.split(';');
        let html = '';
        for (var i = 1; i <= cookies.length; i++) {
            html += cookies[i - 1] + '<br/>';
        }
        document.querySelector('.cookie-list').innerHTML = html;
    }, 1000);
});

// debug
window.cc = cc;

window.addEventListener('load', function () {
    cc.trackDuration();
    cc.trackScrollDepth();
    cc.trackDurationCustom(60, function () {
        cc.eventAnalytics('60s');
    });
    cc.trackScrollDepthCustom(25, function () {
        cc.eventAnalytics('25%');
    });
    document.querySelector('.conversion').addEventListener('click', function (e) {
        cc.eventAnalytics('custom_category', 'custom_action');
        cc.eventAnalytics('custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_action_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        cc.eventLinkedin('id', 'conversion_id');
        cc.eventEtracker('custom_category', 'custom_action');
        cc.eventEtracker('custom_action');
        e.preventDefault();
    });
});
