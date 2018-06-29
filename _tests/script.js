const chefcookie = new window.chefcookie({
    'message': `
        <h2>Wir verwenden Cookies</h2>
        <p>
            Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen.
            Hier können Sie Ihre Einstellungen verwalten. Indem Sie auf "Akzeptieren" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden.
            <a href="https://tld.com/privacy">Mehr erfahren</a>
        </p>
    `,
    'exclude': 'https://tld.com/privacy',
    'groups': [
        {
            'title': 'Analysen',
            'note': 'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
            'active': false,
            'readonly': false,
            'trackers': {
                'google': 'UA-xxxxxxxx-1'
            }
        },
        {
            'title': 'Werbung',
            'note': 'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
            'active': false,
            'readonly': false,
            'trackers': {
                'facebook': 'xxxxxxxxxxxxxxx',
                'twitter': 'single',
                'taboola': 'taboolaaccount-xxxxxxxxxxxxxx',
                'match2one': 'xxxxxxxx',
                'smartlook': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        },
        {
            'title': 'Support',
            'note': 'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
            'active': false,
            'readonly': false,
            'trackers': {
                'custom': ()=>{
                    document.head.insertAdjacentHTML('beforeend',`
                        <script src="custom.js"></script> 
                    `);
                },
            }
        },
        {
            'title': 'Grundlegendes',
            'note': 'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
            'active': true,
            'readonly': true,
            'trackers': {}
        },
    ]    
});

window.addEventListener('load', (e) =>
{
    /*
    // track duration
    chefcookie.trackDuration();
    // track scroll depth
    chefcookie.trackScrollDepth();
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', (e) =>
    { 
        chefcookie.google('custom_category','custom_action');
        chefcookie.facebook('custom_action_name');
        chefcookie.twitter('xxxxx');
        chefcookie.taboola('custom_action_name');
        chefcookie.match2one('id=xxxxxx&seg=xxxxxxxx');
        e.preventDefault();
    });
    */
});