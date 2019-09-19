const cc = new chefcookie({
    message:
        '\
        <h2>Wir verwenden Cookies</h2>\
        <p>\
        Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Einverstanden</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/privacy">Datenschutzerklärung</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.\
        </p>\
    ',
    initial_tracking: false,
    style: {
        layout: 'bottombar', // options: overlay, bottombar
        size: 3, // 1,2,3,4,5
        color: '#e4042d',
        noscroll: true,
        fade: true,
        blur: true
    },
    labels: {
        accept: 'Einverstanden',
        settings_open: 'Meine Einstellungen festlegen',
        settings_close: 'Einstellungen schliessen'
    },
    exclude: [
        '/privacy',
        function() {
            return (
                document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1
            );
        }
    ],
    settings: [
        {
            title: 'Analysen',
            description:
                'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
            active: true,
            hidden: false,
            trackers: {
                analytics: 'UA-77674501-1'
            }
        },
        {
            title: 'Werbung',
            description:
                'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
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
            title: 'Support',
            description:
                'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
            active: true,
            hidden: false
            /*
            'trackers': {
                'custom': function()
                {
                    document.head.insertAdjacentHTML('beforeend',`
                        <script src="custom.js"></script> 
                    `);
                },
            }
            */
        },
        {
            title: 'Grundlegendes',
            description:
                'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
            active: true,
            hidden: true,
            trackers: {}
        }
    ]
});
document.addEventListener('DOMContentLoaded', () => {
    cc.init();
});

window.addEventListener('load', function() {
    // track duration
    cc.trackDuration();
    // track scroll depth
    cc.trackScrollDepth();
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', function(e) {
        cc.eventAnalytics('custom_category', 'custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_action_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        cc.eventEtracker('custom_category', 'custom_action');
        e.preventDefault();
    });
});
