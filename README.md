# 👻 chefcookie 👻

chefcookie is a gdpr cookie solution without compromises.

## features

-   opt in
-   opt out
-   highly customizable
-   custom event tracking
-   duration tracking
-   scroll depth tracking
-   includes basic styling
-   ships two layouts (overlay, bottombar)
-   supports custom tracking scripts
-   auto disable tracking for logged in wordpress users

## included

-   [google analytics](https://analytics.google.com)
-   [google tag manager](https://tagmanager.google.com)
-   [facebook ads](https://de-de.facebook.com/business/products/ads)
-   [twitter ads](https://ads.twitter.com)
-   [taboola ads](https://www.taboola.com)
-   [match2one ads](https://www.match2one.com)
-   [etracker](https://www.etracker.com)
-   [smartlook](https://www.smartlook.com)

## installation

use it as a module:

```
npm install chefcookie
```

```js
import chefcookie from 'chefcookie';
```

or include it the traditional way:

```html
<script src="chefcookie.min.js"></script>
```

## usage

```js
const cc = new chefcookie({
    message: `
        <h2>Wir verwenden Cookies</h2>
        <p>
            Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Einverstanden</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/privacy">Datenschutzerklärung</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.
        </p>
    `,
    initial_tracking: false,
    expiration: 30, // days
    style: {
        layout: 'overlay', // options: overlay, bottombar
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
        // exclude privacy site if needed
        '/privacy',
        // exclude wordpress users
        () => {
            return document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1;
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
                analytics: 'UA-xxxxxxxx-1'
            }
        },
        {
            title: 'Werbung',
            description:
                'Anonyme Informationen, die wir sammeln, um Ihnen nützliche Produkte und Dienstleistungen empfehlen zu können.',
            active: true,
            hidden: false,
            trackers: {
                tagmanager: 'GTM-XXXXXXX',
                facebook: 'xxxxxxxxxxxxxxx',
                twitter: 'single',
                taboola: 'xxxxxxx',
                match2one: 'xxxxxxxx',
                etracker: 'xxxxxx',
                smartlook: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        },
        {
            title: 'Support',
            description: 'Tools, die interaktive Services wie Chat-Support und Kunden-Feedback-Tools unterstützen.',
            active: true,
            hidden: false,
            trackers: {}
        },
        {
            title: 'Grundlegendes',
            description:
                'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
            active: true,
            hidden: true,
            trackers: {
                // add custom trackers
                custom: (resolve, load) => {
                    load(['script1.js', 'script2.js'], function() {
                        resolve();
                    });
                },
                google_maps: () => {
                    if (document.querySelector('iframe[alt-src*="google.com/maps"]') !== null) {
                        document.querySelectorAll('iframe[alt-src*="google.com/maps"]').forEach(el => {
                            el.setAttribute('src', el.getAttribute('alt-src'));
                        });
                    }
                },
                google_recaptcha: resolve => {
                    let script = document.createElement('script');
                    script.setAttribute(
                        'src',
                        'https://www.google.com/recaptcha/api.js?onload=captchaCallback&amp;render=explicit'
                    );
                    script.onload = () => {
                        resolve();
                    };
                    document.head.appendChild(script);
                }
            }
        }
    ]
});
document.addEventListener('DOMContentLoaded', () => {
    cc.init();
});
```

#### opt out links

```html
<a href="#" data-disable="analytics" data-message="Google Analytics aktivieren">Google Analytics deaktivieren</a>
<a href="#" data-disable="tagmanager" data-message="Google Tag Manager aktivieren">Google Tag Manager deaktivieren</a>
<a href="#" data-disable="facebook" data-message="Facebook Pixel aktivieren">Facebook Pixel deaktivieren</a>
<a href="#" data-disable="twitter" data-message="Twitter Pixel aktivieren">Twitter Pixel deaktivieren</a>
<a href="#" data-disable="taboola" data-message="Taboola Pixel aktivieren">Taboola Pixel deaktivieren</a>
<a href="#" data-disable="match2one" data-message="Match2One Pixel aktivieren">Match2One Pixel deaktivieren</a>
<a href="#" data-disable="etracker" data-message="etracker aktivieren">etracker deaktivieren</a>
<a href="#" data-disable="smartlook" data-message="Smartlook aktivieren">Smartlook deaktivieren</a>
```

#### backdoor

just add `?accept=1` to your urls to completely bypass chefcookie.

#### custom trackers

the following keywords are reserved:

-   `analytics`
-   `tagmanager`
-   `facebook`
-   `twitter`
-   `taboola`
-   `match2one`
-   `smartlook`
-   `etracker`

however, you can use any other keyword as described above and execute your own functions.

#### script blocking

the best strategy is to add no scripts at all and let chefcookie add the scripts later.

if you cannot do that (e.g. when you cannot manipulate the page content), there are a lot of techniques and strategies out there to prevent existing scripts from executing:

-   use http content-security-policy headers
-   manipulate embeds (set `type="javascript/blocked"` or `alt-src="..."`)
-   monkey patch `document.createElement`
-   watch and modify with `MutationObserver`
-   abuse `document.write`

chefcookie is flexible and very well works together with e.g. [yett](https://github.com/snipsco/yett):

-   init `yett` before chefcookie to block scripts
-   call `unblock()` inside chefcookies custom trackers

#### dynamically load a script

chefcookie provides a `load`-helper, where you can provide one or multiple urls to load:

```js
load(['script1.js', 'script2.js']);
```

in order to call `resolve()` (see below), you can use:

```js
load(['script1.js', 'script2.js']).then(() => { resolve(); };
load(['script1.js', 'script2.js'], function() { resolve(); }); // also supported
```

#### wait for a tracker

if your javascript is dependent on a specific script loaded by chefcookie, you should handle that case and wait for the tracker being executed:

```js
cc.waitFor('google_recaptcha').then(() => {});
```

this only gets executed when you call `resolve()` inside your custom tracking function.

#### event tracking

chefcookie additionally comes with event tracking for all major analytics platforms:

```js
window.addEventListener('load', e => {
    // track duration (sends action "xxs" in 30 second intervals)
    cc.trackDuration();
    // track scroll depth (sends "xx%" in scroll steps 1, 10, 25, 50, 75, 100)
    cc.trackScrollDepth();
    // custom duration
    cc.trackDurationCustom(60, () => {
        cc.eventAnalytics('60s');
    });
    // custom scroll depth
    cc.trackScrollDepthCustom(25, () => {
        cc.eventAnalytics('25%');
    });
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', () => {
        cc.eventAnalytics('custom_category', 'custom_action');
        cc.eventAnalytics('custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_event_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        cc.eventEtracker('custom_category', 'custom_action');
        cc.eventEtracker('custom_action');
        e.preventDefault();
    });
});
```
