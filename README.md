# 👻 atracker 👻

atracker is a tracker.

## Supports

* [Google Analytics](https://analytics.google.com)
* [Facebook Ads](https://de-de.facebook.com/business/products/ads)
* [Twitter Ads](https://ads.twitter.com)
* [Taboola Ads](https://www.taboola.com)
* [Match2One Ads](https://www.match2one.com)
* [Smartlook](https://www.smartlook.com)

## Features

* Custom event tracking
* Duration tracking
* Scroll depth tracking
* Opt out
* Auto disable tracking for logged in WordPress users

## Installation

```html
<script src="atracker.js"></script>
```

```js
var atracker = new atracker({
    'google': 'UA-xxxxxxxx-1',
    'facebook': 'xxxxxxxxxxxxxxx',
    'twitter': 'single',
    'taboola': 'taboolaaccount-xxxxxxxxxxxxxx',
    'match2one': 'xxxxxxxx',
    'smartlook': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});
```

## Usage

Custom tracking:
```js
window.addEventListener('load', function(e)
{
    // track duration
    atracker.trackDuration();
    // track scroll depth
    atracker.trackScrollDepth();
    // custom tracking
    document.querySelector('.conversion').addEventListener('click', function(e)
    { 
        atracker.google('custom_category','custom_action');
        atracker.facebook('custom_action_name');
        atracker.twitter('conversion_id');
        atracker.taboola('custom_action_name');
        atracker.match2one('id=xxxxxx&seg=xxxxxx');
        e.preventDefault();
    }, false);
}, false);
```

Opt out links:
```html
<a href="#" data-disable="google" data-message="Google Analytics reaktivieren">Google Analytics deaktivieren</a><br/>
<a href="#" data-disable="facebook" data-message="Facebook Pixel reaktivieren">Facebook Pixel deaktivieren</a><br/>
<a href="#" data-disable="twitter" data-message="Twitter Pixel reaktivieren">Twitter Pixel deaktivieren</a><br/>
<a href="#" data-disable="taboola" data-message="Taboola Pixel reaktivieren">Taboola Pixel deaktivieren</a><br/>
<a href="#" data-disable="match2one" data-message="Match2One Pixel reaktivieren">Match2One Pixel deaktivieren</a><br/>
<a href="#" data-disable="smartlook" data-message="Smartlook reaktivieren">Smartlook deaktivieren</a>
```