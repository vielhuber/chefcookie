# 👻 atracker 👻

atracker is a tracker.

## Supports

* Google Analytics
* Facebook
* Twitter
* Taboola
* Match2One
* Smartlook

## Features

* Custom event tracking
* Duration Tracking
* Scroll Depth Tracking
* Opt out

## Installation

```html
<script src="atracker.js"></script>
```

```js
var atracker = new atracker({
    'google': 'UA-77674501-1',
    'facebook': '687761448085259',
    'twitter': 'single',
    'taboola': 'taboolaaccount-socialclose2de',
    'match2one': '11538693',
    'smartlook': 'e63141d523562364440934be8a0d418f17f5123b'
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
        atracker.twitter('nw79o');
        atracker.taboola('custom_action_name');
        atracker.match2one('id=962871&seg=11538694');
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

WordPress
```php
echo '<div class="socialfoo" ';
    echo 'data-url="'.get_permalink().'" ';
    echo 'data-title="'.get_the_title().'" ';
    if( has_post_thumbnail(get_the_ID()) ) {
        echo 'data-image="'.wp_get_attachment_url( get_post_thumbnail_id(get_the_ID()) ).'"';
    }
echo '></div>';
```