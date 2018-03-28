var atracker = function(args)
{

    this.addScripts = function(args)
    {
        for(var args__key in args)
        {
            if (!args.hasOwnProperty(args__key)) { continue; }

            // optout
            if( this.isDisabled(args__key) ) { continue; }

            // wordpress loggedin
            if( document.cookie !== undefined && document.cookie.indexOf('wp-settings-time') > -1 ) { continue; }

            this.addScript(args__key, args[args__key]);
        }
    }

    this.isDisabled = function(provider)
    {
        if( document.cookie !== undefined && document.cookie.indexOf('atracker-disable-'+provider) > -1 )
        {
            return true;
        }
        return false;
    }

    this.addOptOut = function()
    {
        var _this = this;
        window.addEventListener('load', function(e)
        {
            if( document.querySelector('[data-disable]') !== null )
            {
                [].forEach.call(document.querySelectorAll('[data-disable]'), function(el)
                {
                    el.setAttribute('data-message-original', el.textContent);
                    if( _this.isDisabled(el.getAttribute('data-disable')) )
                    {
                        el.textContent = el.getAttribute('data-message');
                    }
                    el.addEventListener('click', function(e)
                    {
                        if( _this.isDisabled(el.getAttribute('data-disable')) )
                        {
                            this.textContent = this.getAttribute('data-message-original');
                            document.cookie = 'atracker-disable-'+this.getAttribute('data-disable')+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
                        }
                        else
                        {
                            this.textContent = this.getAttribute('data-message');
                            document.cookie = 'atracker-disable-'+this.getAttribute('data-disable')+'='+encodeURIComponent('true')+'; '+'expires='+((new Date((new Date()).getTime() + (365*24*60*60*1000))).toUTCString())+'; path=/';
                        }
                        e.preventDefault();
                    });
                });
            }
        }, false);
    }

    this.addScript = function(provider, id)
    {
        if( provider === 'google' )
        {
            var script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id='+id;
            document.head.appendChild(script);
            var script = document.createElement('script');
                script.innerHTML = '\
                    window.dataLayer = window.dataLayer || [];\
                    function gtag(){dataLayer.push(arguments);}\
                    gtag(\'js\', new Date());\
                    gtag(\'config\', \''+id+'\');\
                    gtag(\'config\', \''+id+'\', { \'anonymize_ip\': true });\
                ';
            document.head.appendChild(script);
        }

        if( provider === 'facebook' )
        {
            var script = document.createElement('script');
                script.innerHTML = '\
                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?\
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;\
                    n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];t=b.createElement(e);t.async=!0;\
                    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,\
                    document,\'script\',\'https://connect.facebook.net/en_US/fbevents.js\');\
                    fbq(\'init\', \''+id+'\');\
                    fbq(\'track\', \'PageView\');\
                    fbq(\'track\', \'ViewContent\');\
                ';
            document.head.appendChild(script);
        }

        if( provider === 'twitter' )
        {
            var script = document.createElement('script');
                script.src = '//platform.twitter.com/oct.js';
            document.head.appendChild(script);
        }

        if( provider === 'taboola' )
        {
            var script = document.createElement('script');
                script.innerHTML = '\
                    window._tfa = window._tfa || [];\
                    _tfa.push({ notify: \'action\',name: \'page_view\' });\
                ';
            document.head.appendChild(script);
            var script = document.createElement('script');
                script.src = '//cdn.taboola.com/libtrc/'+id+'/tfa.js';
            document.head.appendChild(script);
        }

        if( provider === 'match2one' )
        {
            var script = document.createElement('script');
                script.src = 'https://secure.adnxs.com/seg?add='+id+'&t=1';
            document.head.appendChild(script);
        }

        if( provider === 'smartlook' )
        {
            var script = document.createElement('script');
                script.innerHTML = '\
                    window.smartlook||(function(d) {\
                    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName(\'head\')[0];\
                    var c=d.createElement(\'script\');o.api=new Array();c.async=true;c.type=\'text/javascript\';\
                    c.charset=\'utf-8\';c.src=\'https://rec.smartlook.com/recorder.js\';h.appendChild(c);\
                    })(document);\
                    smartlook(\'init\', \''+id+'\');\
                ';
            document.head.appendChild(script);
        }

        console.log('added script '+provider);

    }

    this.google = function(category, action)
    {
        if( this.isDisabled('google') )
        {
            return;
        }
        if( typeof gtag != 'function' )
        {
            return;
        }
        if( action === undefined )
        {
            gtag('event', '', { 'event_category': category });
            console.log('google '+category);
        }
        else
        {
            gtag('event', action, { 'event_category': category });
            console.log('google '+category+' '+action);
        }
    }

    this.facebook = function(action)
    {
        if( this.isDisabled('facebook') )
        {
            return;
        }
        if( typeof fbq != 'function' )
        {
            return;
        }
        fbq('trackCustom', action);
        console.log('facebook '+action);
    }

    this.twitter = function(action)
    {
        if( this.isDisabled('twitter') )
        {
            return;
        }
        if( typeof twttr == 'undefined' || typeof twttr.conversion == 'undefined' || typeof twttr.conversion.trackPid != 'function' )
        {
            return;
        }
        twttr.conversion.trackPid(action);
        console.log('twitter '+action);
    }


    this.taboola = function(action)
    {
        if( this.isDisabled('taboola') )
        {
            return;
        }
        if( typeof _tfa != 'function' )
        {
            return;
        }
        _tfa.push({ notify: 'action', name: action });
        console.log('taboola '+action);
    }

    this.match2one = function(id)
    {
        if( this.isDisabled('match2one') )
        {
            return;
        }
        var script = document.createElement('script');
            script.src = 'https://secure.adnxs.com/px?'+id+'&t=1';
        document.head.appendChild(script);
        console.log('match2one '+id);
    }

    this.trackDuration = function()
    {
        var _this = this;
        var timer = 30;
        while((timer/60) <= 8)
        {
            (function(timer)
            {
                window.setTimeout(function()
                {
                    _this.google('duration_time', timer+'s');
                },timer*1000);
            })(timer);
            timer += 30;
        }
    }

    this.trackScrollDepth = function()
    {
        var _this = this;
        var scrollDepthTriggered = { 1: false, 10: false, 25: false, 50: false, 75: false, 100: false };
        _this.google('scroll_depth', '0%');
        window.addEventListener('scroll', function()
        {
            var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            var documentHeight = Math.max(document.body.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight, document.documentElement.scrollHeight);
            var windowHeight = window.innerHeight;
            var scroll = Math.round((scrollTop/(documentHeight-windowHeight))*100);
            for(var scrollDepthTriggered__key in scrollDepthTriggered)
            {
                if(scrollDepthTriggered[scrollDepthTriggered__key] === false && scroll >= scrollDepthTriggered__key) {
                    scrollDepthTriggered[scrollDepthTriggered__key] = true;
                    _this.google('scroll_depth', scrollDepthTriggered__key+'%');
                }
            };
        });
    }

    this.addScripts(args);
    this.addOptOut();

}