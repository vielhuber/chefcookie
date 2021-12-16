# 👻 chefcookie 👻

[![NPM](https://img.shields.io/npm/v/chefcookie.svg)](https://www.npmjs.com/package/chefcookie)

chefcookie is a gdpr cookie solution without compromises.

## features

-   opt in/out
-   highly customizable
-   custom event tracking
-   duration tracking
-   scroll depth tracking
-   includes basic styling
-   multi language support
-   ships multiple layouts (overlay, bottombar, topbar)
-   supports custom tracking scripts
-   auto disable tracking for logged in wordpress users
-   ie11 support available
-   script grouping with optional optin on script level

## included

-   [google analytics](https://analytics.google.com)
-   [google tag manager](https://tagmanager.google.com)
-   [facebook ads](https://de-de.facebook.com/business/products/ads)
-   [twitter ads](https://ads.twitter.com)
-   [taboola ads](https://www.taboola.com)
-   [match2one ads](https://www.match2one.com)
-   [linkedin](https://business.linkedin.com/marketing-solutions/conversion-tracking)
-   [etracker](https://www.etracker.com)
-   [matomo analytics](https://matomo.org)
-   [smartlook](https://www.smartlook.com)
-   [crazy egg](https://www.crazyegg.com)
-   [google maps](https://developers.google.com/maps/documentation/javascript/tutorial)

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
    message: {
        de: `
            <h2>Wir verwenden Cookies</h2>
            <p>
                Unsere Website verwendet Cookies, die uns helfen, unsere Website zu verbessern, den bestmöglichen Service zu bieten und ein optimales Kundenerlebnis zu ermöglichen. <a href="#chefcookie__settings">Hier</a> können Sie Ihre Einstellungen verwalten. Indem Sie auf "<a href="#chefcookie__accept">Akzeptieren</a>" klicken, erklären Sie sich damit einverstanden, dass Ihre Cookies für diesen Zweck verwendet werden. Weitere Informationen dazu finden Sie in unserer <a href="/de/datenschutz">Datenschutzerklärung</a> sowie im <a href="/de/impressum">Impressum</a>. Sollten Sie hiermit nicht einverstanden sein, können Sie die Verwendung von Cookies hier <a href="#chefcookie__decline">ablehnen</a>.
            </p>
        `,
        en: `
            <h2>We use cookies</h2>
            <p>
                Our website uses cookies that help us to improve our website, provide the best possible service and enable an optimal customer experience. <a href="#chefcookie__settings">Here</a> you can manage your settings. By clicking on "<a href="#chefcookie__accept">Accept</a>", you agree that your cookies may be used for this purpose. You can find further information on this in our <a href="/en/privacy">data protection declaration</a> and in the <a href="/en/imprint">imprint</a>. If you do not agree to this, you can refuse the use of cookies here <a href="#chefcookie__decline">reject</a> the use of cookies.
            </p>
        `
    },
    accept_all_if_settings_closed: true,
    show_decline_button: false,
    scripts_selection: 'collapse', // false|true|'collapse'
    debug_log: false,
    consent_tracking: null, // '/wp-json/v1/track-consent.php'
    expiration: 7, // in days
    cookie_prefix: 'cc_', // switch cookie prefix (e.g. for different pages on the same top level domain)
    exclude_google_pagespeed: true,
    style: {
        layout: 'overlay', // overlay|bottombar|topbar
        size: 3, // 1|2|3|4|5
        color_text: '#595f60',
        color_highlight: '#ff0000',
        color_background: '#eeeeee',
        highlight_accept: true,
        show_disabled_checkbox: true,
        noscroll: true,
        fade: true,
        blur: true,
        css_replace: ``, // replace plugin's styles with custom css
        css_add: `` // enhance plugin's styles with custom css
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
    exclude: [
        // exclude privacy site if needed
        '/de/datenschutz',
        '/en/privacy',
        '/de/impressum',
        '/en/imprint',
        // exclude wordpress users
        () => {
            return document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1;
        }
    ],
    settings: [
        {
            title: { de: 'Analysen', en: 'Analyses' },
            description: {
                de: 'Tools, die anonyme Daten über Website-Nutzung und -Funktionalität sammeln. Wir nutzen die Erkenntnisse, um unsere Produkte, Dienstleistungen und das Benutzererlebnis zu verbessern.',
                en: 'Tools that collect anonymous data about website usage and functionality. We use this information to improve our products, services and user experience.'
            },
            checked_by_default: true,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {
                analytics: 'UA-xxxxxxxx-1',
                // extended syntax
                analytics: {
                    id: 'UA-xxxxxxxx-1',
                    title: { de: 'Google Analytics', en: 'Google Analytics' },
                    description: {
                        de: 'Die Verwendung der Analyse Cookies erfolgt zu dem Zweck, die Qualität unserer Website und ihre Inhalte zu verbessern und die Funktionsfähigkeit von eingebundenen Diensten unserer Partner sicherzustellen.',
                        en: `
                            <p>
                                Google Analytics cookies are used to improve the quality of our website and its content and to ensure the functionality of integrated services of our partners.
                            </p>
                            <table>
                                <tr><td>Name:</td><td>_gid</td></tr>
                                <tr><td>Host:</td><td>www.tld.com</td></tr>
                                <tr><td>Duration:</td><td>Session</td></tr>
                                <tr><td>Type:</td><td>1st Party</td></tr>
                                <tr><td>Description:</td><td>This is a pattern type cookie name associated with a marketing cloud. It stores an unique visitor identifier, and uses an organisation identifier.</td></tr>
                            </table>
                        `
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
                tagmanager: 'GTM-XXXXXXX',
                facebook: 'xxxxxxxxxxxxxxx',
                twitter: 'single',
                taboola: 'xxxxxxx',
                match2one: 'xxxxxxxx',
                linkedin: 'xxxxxxx',
                etracker: 'xxxxxx',
                matomo: 'xxxxxx#x', // domain/siteid
                smartlook: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                crazyegg: 'xxxx/xxxx',
                google_maps: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }
        },
        {
            title: { de: 'Drittanbieter', en: 'Third-party' },
            description: {
                de: 'Tools, die interaktive Services wie beispielsweise Video- und Kartendienste unterstützen.',
                en: 'Tools that support interactive services such as video and map services.'
            },
            checked_by_default: true,
            cannot_be_modified: false,
            initial_tracking: false,
            scripts: {}
        },
        {
            title: { de: 'Grundlegendes', en: 'Basics' },
            description: {
                de: 'Tools, die wesentliche Services und Funktionen ermöglichen, einschließlich Identitätsprüfung, Servicekontinuität und Standortsicherheit. Diese Option kann nicht abgelehnt werden.',
                en: 'Tools that enable essential services and functions, including identity verification, service continuity, and site security. This option cannot be declined.'
            },
            checked_by_default: true,
            cannot_be_modified: true,
            initial_tracking: true,
            scripts: {
                example_script1: {}, // this immediately gets "resolved"
                example_script2: {
                    accept: (cc, resolve, isInit) => {
                        /* example: load default scripts inside custom script */
                        cc.load('analytics', 'UA-xxxxxxxx-1');
                        cc.load('tagmanager', 'GTM-XXXXXXX');
                        cc.load('facebook', 'xxxxxxxxxxxxxxx');
                        cc.load('twitter', 'single');
                        cc.load('taboola', 'xxxxxxx');
                        cc.load('match2one', 'xxxxxxxx');
                        cc.load('linkedin', 'xxxxxxx');
                        cc.load('etracker', 'xxxxxx');
                        cc.load('matomo', 'xxxxxx#x');
                        cc.load('smartlook', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                        cc.load('crazyegg', 'xxxx/xxxx');
                        cc.load('google_maps', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

                        /* example: load (multiple) custom javascripts */
                        cc.loadJs([
                            'script1.js',
                            'script2.js',
                            'https://www.googletagmanager.com/gtag/js?id=UA-xxxxxxxx-1'
                        ]).then(() => {
                            resolve();
                        });

                        /* example: enable uninitialized iframes */
                        if (document.querySelector('iframe[alt-src*="google.com/maps"]') !== null) {
                            document.querySelectorAll('iframe[alt-src*="google.com/maps"]').forEach(el => {
                                el.setAttribute('src', el.getAttribute('alt-src'));
                            });
                        }

                        /* example: load scripts manually */
                        let script1 = document.createElement('script');
                        script1.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=UA-xxxxxxxx-1');
                        script1.onload = () => {
                            resolve();
                        };
                        document.head.appendChild(script1);

                        /* example: load scripts manually */
                        let script2 = document.createElement('script');
                        let html = "alert('OK');";
                        script2.innerHTML = html;
                        document.head.appendChild(script2);

                        /* example: load scripts manually (with custom callback) */
                        window.captchaCallback = () => {
                            resolve();
                        };
                        cc.loadJs('https://www.google.com/recaptcha/api.js?onload=captchaCallback&amp;render=explicit');

                        /*
                        important: always call resolve to show that the script fully has loaded!
                        if you don't want the accept logic to be inside this function, only call resolve() and use waitFor outside this function to fire further actions */
                        resolve();

                        /* some other helpers */
                        cc.url(); // gets the current url
                        cc.lng(); // gets the current lng
                        isInit; // true|false (accepted actively through click and not via cookie)
                    },
                    exclude: () => {
                        return document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1;
                    },
                    title: { de: '...', en: '...' },
                    description: { de: '...', en: '...' }
                }
            }
        }
    ]
});
document.addEventListener('DOMContentLoaded', () => {
    cc.init();
});
```

#### multi language support

instead of plain text you can provide language objects for any label:

```js
{
    title: 'Werbung';
}
```

```js
{
    title: { de: 'Werbung', en: 'Advertising' }
}
```

chefcookie will find out the current language and show the appropriate strings.

#### opt out links

its recommended to place those kind of links inside your privacy page:

```html
<a href="#" data-cc-disable="analytics" data-cc-message="Google Analytics aktivieren">Google Analytics deaktivieren</a>
<a href="#" data-cc-disable="tagmanager" data-cc-message="Google Tag Manager aktivieren"
    >Google Tag Manager deaktivieren</a
>
<a href="#" data-cc-disable="facebook" data-cc-message="Facebook Pixel aktivieren">Facebook Pixel deaktivieren</a>
<a href="#" data-cc-disable="twitter" data-cc-message="Twitter Pixel aktivieren">Twitter Pixel deaktivieren</a>
<a href="#" data-cc-disable="taboola" data-cc-message="Taboola Pixel aktivieren">Taboola Pixel deaktivieren</a>
<a href="#" data-cc-disable="match2one" data-cc-message="Match2One Pixel aktivieren">Match2One Pixel deaktivieren</a>
<a href="#" data-cc-disable="linkedin" data-cc-message="LinkedIn Pixel aktivieren">LinkedIn Pixel deaktivieren</a>
<a href="#" data-cc-disable="etracker" data-cc-message="etracker aktivieren">etracker deaktivieren</a>
<a href="#" data-cc-disable="matomo" data-cc-message="Matomo aktivieren">Matomo deaktivieren</a>
<a href="#" data-cc-disable="smartlook" data-cc-message="Smartlook aktivieren">Smartlook deaktivieren</a>
<a href="#" data-cc-disable="crazyegg" data-cc-message="Crazy Egg aktivieren">Crazy Egg deaktivieren</a>
<a href="#" data-cc-disable="google_maps" data-cc-message="Google Maps aktivieren">Google Maps deaktivieren</a>
```

you can style those links with:

```css
[data-cc-disable] {
}
[data-cc-disable].disabled {
}
```

#### (one time) opt in links

these links self destroy if the respective script is accepted:

```html
<div data-cc-enable="google_maps">
    Ich möchte Google Maps-Inhalte aktivieren und stimme zu, dass Daten von Google geladen werden (siehe
    <a href="/de/datenschutz" target="_blank">Datenschutz</a>).
</div>
```

it is recommended to place them inside your via js populated divs (like a google maps wrapper).\
if you click on it, the script is explicitly accepted.

#### manually accept/decline

```js
cc.accept('analytics');
cc.decline('analytics');
cc.isAccepted('analytics'); // true|false
```

#### backdoor

just add `?accept=1` to your urls to completely bypass chefcookie.

#### custom scripts

the following keywords as keys are reserved:

-   `analytics`
-   `tagmanager`
-   `facebook`
-   `twitter`
-   `taboola`
-   `match2one`
-   `linkedin`
-   `etracker`
-   `matomo`
-   `smartlook`
-   `crazyegg`
-   `google_maps`

if you provide strings as values, chefcookie interprets them appropriately. chefcookie then loads the libraries with reasonable default settings. however, you can execute your own functions in either overwriting the values of these reserved keywords (and provide an object) or use any other keyword.

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
-   call `unblock()` inside chefcookies custom scripts

#### dynamically load a script

chefcookie provides a `load`-helper, where you can provide one or multiple urls to load:

```js
cc.loadJs(['script1.js', 'script2.js']);
```

in order to call `resolve()` (see below), you can use:

```js
cc.loadJs(['script1.js', 'script2.js']).then(() => { resolve(); };
cc.loadJs(['script1.js', 'script2.js'], () => { resolve(); }); // also supported
```

#### wait for a tracker

if your javascript is dependent on a specific script loaded by chefcookie, you should handle that case and wait for the tracker being executed:

```js
cc.waitFor('google_recaptcha').then(() => {});
cc.waitFor('google_recaptcha', () => {}); // also supported
```

this only gets executed when you call `resolve()` inside your custom tracking function.

#### more

the cookie banner is shown always, if no consent is saved.\
if done so, it is shown again, after the cookie expired (see the `expiration`-setting).

it is recommended to include a (re)opening link in the privacy policy, for example.\
here you can also use the following code:

```html
<a href="#" data-cc-open>Consent-Einstellungen bearbeiten</a>
```

you can programmatically control chefcookie via javascript:

-   `cc.open()`: open the cookie banner manually
-   `cc.isOpen()`: check if cookie banner is opened
-   `cc.close()`: close the cookie banner manually
-   `cc.destroy()`: destroy the cookie banner and all event listeners
-   `cc.updateOptOutOptIn()`: refreshes the state of opt out / opt in buttons

#### consent manager tracking

to test the acceptance of the consent manager, it is recommended to use the `consent_tracking`-option. if you specify an url (relative or absolute) there, chefcookie sends a post-request with analysis data for every action that a user performs in the consent manager. these requests have the form:

```json
{
    "action": "accept_all",
    "date": "2021-01-01 10:00:00",
    "url": "https://tld.com?foo=bar",
    "providers": "analytics,facebook,twitter",
    "viewport": "the viewport size of the user device"
}
```

`url` as you can see consists of potential get-paramaters (so that you can analyze e.g. google ads campaigns).\
take note that nor ip or user agent are posted, but feel free to catch and store these parts with the help of a php endpoint.

the `action`-key can have the following values:

-   `open`: the consent manager is shown
-   `accept_all`: all providers are accepted
-   `accept_partially`: providers are accepted partially
-   `decline`: all providers are declined
-   `settings_open`: settings are opened
-   `settings_close`: settings are closed
-   `first_user_interaction`: first mouse/touch/scroll interaction happened

here it makes sense to temporarily store this data in a database and evaluate it – for example, to measure the discrepancy between the real visitor numbers and the numbers in google analytics or to optimize the appearance of the consent manager (e.g. using the `layout`-option).

#### event tracking

chefcookie additionally comes with event tracking for all major analytics platforms.\
you can even use this feature with side loaded scripts.

```js
window.addEventListener('load', () => {
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
    document.querySelector('.conversion').addEventListener('click', e => {
        cc.eventAnalytics('custom_category', 'custom_action');
        cc.eventAnalytics('custom_action');
        cc.eventFacebook('custom_action_name');
        cc.eventTwitter('conversion_id');
        cc.eventTaboola('custom_event_name');
        cc.eventMatch2one('id=xxxxxx&seg=xxxxxx');
        cc.eventLinkedin('id', 'conversion_id');
        cc.eventEtracker('custom_category', 'custom_action');
        cc.eventEtracker('custom_action');
        e.preventDefault();
    });
});
```
