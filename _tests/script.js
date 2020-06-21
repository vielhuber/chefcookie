const cc = new chefcookie({
    message: {
        de:
            '\
            <h2>Wir verwenden Cookies</h2>\
            <p>\
                Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Einverstanden</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/de/datenschutz">Datenschutzerklärung</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.\
            </p>\
        ',
        en:
            '\
            <h2>We use cookies</h2>\
            <p>\
                Our website uses cookies that help us to improve our website, provide the best possible service and enable an optimal customer experience. <a href="#chefcookie__settings">Here</a> you can manage your settings. By clicking on "<a href="#chefcookie__accept">Agree</a>", you agree that your cookies may be used for this purpose. You can find further information on this in our <a href="/en/privacy">data protection declaration</a>. If you do not agree to this, you can refuse the use of cookies here <a href="#chefcookie__decline">reject</a> the use of cookies.\
            </p>\
        '
    },
    initial_tracking: false,
    expiration: 1,
    style: {
        layout: 'bottombar', // options: overlay, bottombar
        size: 3, // 1,2,3,4,5
        color: '#e4042d',
        noscroll: true,
        fade: true,
        blur: true
    },
    labels: {
        accept: { de: 'Einverstanden', en: 'Agree' },
        settings_open: { de: 'Meine Einstellungen festlegen', en: 'Change settings' },
        settings_close: { de: 'Einstellungen schliessen', en: 'Close settings' }
    },
    exclude: [
        '/de/datenschutz',
        '/en/privacy',
        function() {
            return document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1;
        }
    ],
    settings: [
        {
            title: { de: 'Analysen', en: 'Analyses' },
            description: {
                de:
                    'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
                en:
                    'Tools that collect anonymous data about website usage and functionality. We use this information to improve our products, services and user experience.'
            },
            active: true,
            hidden: false,
            trackers: {
                analytics: 'UA-77674501-1'
            }
        },
        {
            title: { de: 'Werbung', en: 'Advertising' },
            description: {
                de:
                    'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
                en: 'Anonymous information that we collect in order to recommend useful products and services to you.'
            },
            active: true,
            hidden: false,
            trackers: {
                tagmanager: 'GTM-N667H38',
                facebook: '687761448085259',
                twitter: 'single',
                taboola: '1117744',
                match2one: '11538693',
                smartlook: 'e63141d523562364440934be8a0d418f17f5123b',
                etracker: 'OBVSQs'
            }
        },
        {
            title: { de: 'Support', en: 'Support' },
            description: {
                de: 'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
                en: 'Tools that support interactive services such as chat support and customer feedback tools.'
            },
            active: true,
            hidden: false
        },
        {
            title: { de: 'Grundlegendes', en: 'Basics' },
            description: {
                de:
                    'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
                en:
                    'Tools that enable essential services and functions, including identity verification, service continuity, and site security. This option cannot be declined.'
            },
            active: true,
            hidden: true,
            trackers: {
                google_maps: function() {
                    if (document.querySelector('iframe[alt-src*="google.com/maps"]') !== null) {
                        [].forEach.call(document.querySelectorAll('iframe[alt-src*="google.com/maps"]'), function(el) {
                            el.setAttribute('src', el.getAttribute('alt-src'));
                        });
                    }
                },
                google_recaptcha: function(resolve, load) {
                    load(
                        'https://www.google.com/recaptcha/api.js?onload=captchaCallback&amp;render=explicit',
                        function() {
                            resolve();
                        }
                    );
                }
            }
        }
    ]
});
document.addEventListener('DOMContentLoaded', function() {
    cc.init();
    cc.waitFor('google_recaptcha', function() {
        alert('google_recaptcha');
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
