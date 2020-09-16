const cc = new chefcookie({
    message: {
        de:
            '\
            <h2>Wir verwenden Cookies</h2>\
            <p>\
                Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Akzeptieren</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/de/datenschutz">Datenschutzerklärung</a> sowie im <a href="/de/impressum">Impressum</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.\
            </p>\
        ',
        en:
            '\
            <h2>We use cookies</h2>\
            <p>\
                Our website uses cookies that help us to improve our website, provide the best possible service and enable an optimal customer experience. <a href="#chefcookie__settings">Here</a> you can manage your settings. By clicking on "<a href="#chefcookie__accept">Accept</a>", you agree that your cookies may be used for this purpose. You can find further information on this in our <a href="/en/privacy">data protection declaration</a> and in the <a href="/en/imprint">imprint</a>. If you do not agree to this, you can refuse the use of cookies here <a href="#chefcookie__decline">reject</a> the use of cookies.\
            </p>\
        '
    },
    accept_all_if_settings_closed: true,
    debug_log: true,
    expiration: 1,
    style: {
        layout: 'overlay', // options: overlay, bottombar
        size: 3, // 1,2,3,4,5
        color_text: '#eee',
        color_highlight: 'blue',
        color_background: '#000',
        highlight_accept: true,
        show_disabled_checkbox: true,
        noscroll: true,
        fade: true,
        blur: true
    },
    labels: {
        accept: { de: 'Akzeptieren', en: 'Accept' },
        accept_all: { de: 'Alles akzeptieren', en: 'Accept all' },
        settings_open: { de: 'Meine Einstellungen festlegen', en: 'Change settings' },
        settings_close: { de: 'Einstellungen schliessen', en: 'Close settings' }
    },
    exclude: ['/de/datenschutz', '/en/privacy', '/de/impressum', '/en/imprint'],
    settings: [
        {
            title: { de: 'Analysen', en: 'Analyses' },
            description: {
                de:
                    'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
                en:
                    'Tools that collect anonymous data about website usage and functionality. We use this information to improve our products, services and user experience.'
            },
            checked_by_default: false,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {
                analytics: 'UA-77674501-1',
                google_maps_iframe: {
                    accept: function() {
                        if (document.querySelector('iframe[alt-src*="google.com/maps"]') !== null) {
                            [].forEach.call(document.querySelectorAll('iframe[alt-src*="google.com/maps"]'), function(
                                el
                            ) {
                                el.setAttribute('src', el.getAttribute('alt-src'));
                            });
                        }
                    }
                },
                google_recaptcha: {
                    accept: function(cc, resolve, isInit) {
                        cc.loadJs(
                            'https://www.google.com/recaptcha/api.js?onload=captchaCallback&amp;render=explicit',
                            function() {
                                resolve();
                            }
                        );
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
                de:
                    'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
                en: 'Anonymous information that we collect in order to recommend useful products and services to you.'
            },
            checked_by_default: false,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {
                tagmanager: 'GTM-N667H38',
                facebook: '687761448085259',
                twitter: 'single',
                taboola: '1117744',
                match2one: '11538693',
                smartlook: 'e63141d523562364440934be8a0d418f17f5123b',
                google_maps: 'AIzaSyA6vG4lM68kiwiM8Vh2Mg24vXj057gC8QM'
            }
        },
        {
            title: { de: 'Support', en: 'Support' },
            description: {
                de: 'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
                en: 'Tools that support interactive services such as chat support and customer feedback tools.'
            },
            checked_by_default: true,
            cannot_be_modified: false,
            initial_tracking: false
        },
        {
            title: { de: 'Grundlegendes', en: 'Basics' },
            description: {
                de:
                    'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
                en:
                    'Tools that enable essential services and functions, including identity verification, service continuity, and site security. This option cannot be declined.'
            },
            checked_by_default: true,
            cannot_be_modified: true,
            initial_tracking: true,
            scripts: {
                etracker_custom: {
                    accept: function(cc) {
                        cc.load('etracker', 'OBVSQs');
                    }
                }
            }
        }
    ]
});
document.addEventListener('DOMContentLoaded', function() {
    cc.init();
    cc.waitFor('google_recaptcha', function() {
        console.log('google_recaptcha fully loaded');
    });
    document.querySelector('.manual').innerText = 'Akzeptieren/Ablehnen';
    document.querySelector('.manual').addEventListener('click', function(e) {
        if (cc.isAccepted('analytics')) {
            cc.decline('analytics');
            e.currentTarget.innerText = 'Akzeptieren';
        } else {
            cc.accept('analytics');
            e.currentTarget.innerText = 'Ablehnen';
        }
        e.preventDefault();
    });
    document.querySelector('.open_again').addEventListener('click', function(e) {
        cc.open();
        e.preventDefault();
    });
});

window.addEventListener('load', function() {
    cc.trackDuration();
    cc.trackScrollDepth();
    cc.trackDurationCustom(60, function() {
        cc.eventAnalytics('60s');
    });
    cc.trackScrollDepthCustom(25, function() {
        cc.eventAnalytics('25%');
    });
    document.querySelector('.conversion').addEventListener('click', function(e) {
        cc.eventAnalytics('custom_category', 'custom_action');
        cc.eventAnalytics('custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_action_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        cc.eventEtracker('custom_category', 'custom_action');
        cc.eventEtracker('custom_action');
        e.preventDefault();
    });
});
