# 👻 chefcookie 👻

chefcookie is a gdpr cookie solution without compromises.

## features

* opt in
* opt out
* highly customizable
* custom event tracking
* duration tracking
* scroll depth tracking
* includes basic styling
* supports custom tracking scripts
* auto disable tracking for logged in wordpress users

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
```js
const cc = new chefcookie({});
```

or include it the traditional way:
```html
<script src="chefcookie.min.js"></script>
```
```js
var cc = new window.chefcookie({});
```

## configuration

```js
{
    'message': `
        <h2>Wir verwenden Cookies</h2>
        <p>
            Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen.
            Hier können Sie Ihre Einstellungen verwalten. Indem Sie auf "Akzeptieren" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden.
            <a href="https://tld.com/privacy">Mehr erfahren</a>
        </p>
    `,
    'color': '#e4042d',
    'labels': {
        'decline': 'Ablehnen',
        'settings_open': 'Meine Einstellungen verwalten',
        'settings_close': 'Einstellungen schließen',
        'accept': 'Akzeptieren',
        'confirm': 'Bestätigen'
    },
    'exclude': [
        'https://tld.com/privacy',
        ()=>{ return ( document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1 ); }
    ],
    'settings': [
        {
            'title': 'Analysen',
            'description': 'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
            'active': false,
            'hidden': false,
            'trackers': {
                'google': 'UA-xxxxxxxx-1'
            }
        },
        {
            'title': 'Werbung',
            'description': 'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
            'active': false,
            'hidden': false,
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
            'description': 'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
            'active': false,
            'hidden': false,
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
            'description': 'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
            'active': true,
            'hidden': true,
            'trackers': {}
        },
    ]    
}
```

#### custom tracking

```js
window.addEventListener('load', (e) =>
{
    // track duration
    cc.trackDuration();
    // track scroll depth
    cc.trackScrollDepth();
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', (e) =>
    { 
        cc.eventGoogle('custom_category','custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_action_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        e.preventDefault();
    });
});
```

#### opt out links

```html
<a href="#" data-disable="google" data-message="Google Analytics aktivieren">Google Analytics deaktivieren</a><br/>
<a href="#" data-disable="facebook" data-message="Facebook Pixel aktivieren">Facebook Pixel deaktivieren</a><br/>
<a href="#" data-disable="twitter" data-message="Twitter Pixel aktivieren">Twitter Pixel deaktivieren</a><br/>
<a href="#" data-disable="taboola" data-message="Taboola Pixel aktivieren">Taboola Pixel deaktivieren</a><br/>
<a href="#" data-disable="match2one" data-message="Match2One Pixel aktivieren">Match2One Pixel deaktivieren</a><br/>
<a href="#" data-disable="smartlook" data-message="Smartlook aktivieren">Smartlook deaktivieren</a>
```