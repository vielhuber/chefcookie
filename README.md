# 👻 chefcookie 👻

chefcookie is a gdpr cookie solution without compromises.

## features

* includes basic styling
* custom tracking scripts
* custom event tracking
* duration tracking
* scroll depth tracking
* opt in
* opt out
* auto disable tracking for logged in wordpress users
* button labels support multiple languages

## supports

* [google analytics](https://analytics.google.com)
* [facebook ads](https://de-de.facebook.com/business/products/ads)
* [twitter ads](https://ads.twitter.com)
* [taboola ads](https://www.taboola.com)
* [match2one ads](https://www.match2one.com)
* [smartlook](https://www.smartlook.com)

## installation

use it as a module:
```
npm install chefcookie
```
```js
import chefcookie from 'chefcookie';
```

or include it directly:
```html
<script src="chefcookie.min.js"></script>
```


## usage

init:
```js
const chefcookie = new chefcookie({
    'message': `
        <h2>Wir verwenden Cookies</h2>
        <p>
            Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen.
            Hier können Sie Ihre Einstellungen verwalten. Indem Sie auf "Akzeptieren" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden.
            <a href="https://tld.com/privacy">Mehr erfahren</a>
        </p>
    `,
    'exclude': [
        'https://tld.com/privacy',
        ()=>{ return ( document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1 ); }
    ],
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
```

custom tracking:
```js
window.addEventListener('load', (e) =>
{
    // track duration
    chefcookie.trackDuration();
    // track scroll depth
    chefcookie.trackScrollDepth();
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', function(e)
    { 
        chefcookie.google('custom_category','custom_action');
        chefcookie.facebook('custom_action_name');
        chefcookie.twitter('conversion_id');
        chefcookie.taboola('custom_action_name');
        chefcookie.match2one('id=xxxxxx&seg=xxxxxx');
        e.preventDefault();
    });
});
```

opt out links:
```html
<a href="#" data-disable="google" data-message="Google Analytics reaktivieren">Google Analytics deaktivieren</a><br/>
<a href="#" data-disable="facebook" data-message="Facebook Pixel reaktivieren">Facebook Pixel deaktivieren</a><br/>
<a href="#" data-disable="twitter" data-message="Twitter Pixel reaktivieren">Twitter Pixel deaktivieren</a><br/>
<a href="#" data-disable="taboola" data-message="Taboola Pixel reaktivieren">Taboola Pixel deaktivieren</a><br/>
<a href="#" data-disable="match2one" data-message="Match2One Pixel reaktivieren">Match2One Pixel deaktivieren</a><br/>
<a href="#" data-disable="smartlook" data-message="Smartlook reaktivieren">Smartlook deaktivieren</a>
```