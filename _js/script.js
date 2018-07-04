import helper from './_helper';

export default class chefcookie
{

    constructor(config = {})
    {
        this.config = config;
        document.addEventListener('DOMContentLoaded', () =>
        {
            this.init();
        });
    }

    init()
    {
        if( this.forceAccept() )
        {
            this.addAllProvidersToCookie();
        }

        this.initOptOut();
        
        if( this.isExcluded() )
        {
            return;
        }

        if( this.cookieExists() )
        {
            this.addEnabledScripts();
        }

        else
        {
            this.addStyle();
            this.buildDom();
            this.bindButtons();
        }
    }

    forceAccept()
    {
        return helper.getParam('accept') === '1';
    }

    initOptOut()
    {
        if( document.querySelector('[data-disable]') !== null )
        {
            [].forEach.call(document.querySelectorAll('[data-disable]'), (el) =>
            {
                el.setAttribute('data-message-original', el.textContent);
                if( !this.isEnabled(el.getAttribute('data-disable')) )
                {
                    el.textContent = el.getAttribute('data-message');
                }
                else
                {
                    el.textContent = el.getAttribute('data-message-original');
                }
                el.addEventListener('click', (e) =>
                {
                    if( !this.isEnabled(el.getAttribute('data-disable')) )
                    {
                        e.currentTarget.textContent = e.currentTarget.getAttribute('data-message-original');
                        this.addToCookie(e.currentTarget.getAttribute('data-disable'));
                    }
                    else
                    {
                        e.currentTarget.textContent = e.currentTarget.getAttribute('data-message');
                        this.deleteFromCookie(e.currentTarget.getAttribute('data-disable'));
                    }
                    e.preventDefault();
                });
            });
        }
    }

    updateOptOut()
    {
        if( document.querySelector('[data-disable]') !== null )
        {
            [].forEach.call(document.querySelectorAll('[data-disable]'), (el) =>
            {
                if( !this.isEnabled(el.getAttribute('data-disable')) )
                {
                    el.textContent = el.getAttribute('data-message');
                }
                else
                {
                    el.textContent = el.getAttribute('data-message-original');
                }
            });
        }
    }

    isExcluded()
    {
        if( this.config.exclude === undefined )
        {
            return false;
        }
        let excluded = false;
        this.config.exclude.forEach((exclude__value) =>
        {
            if( typeof exclude__value === 'function' && exclude__value() === true )
            {
                 excluded = true;
            }
            if( typeof exclude__value === 'string' && exclude__value === helper.url() )
            {
                excluded =  true;
            }
        });
        return excluded;
    }

    cookieExists()
    {
        return helper.cookieExists('chefcookie');
    }

    addStyle()
    {
        document.head.insertAdjacentHTML('beforeend',`
        <style>
            .chefcookie, .chefcookie *
            {
                box-sizing: border-box;
                margin:0;
                padding:0;
            }
            .chefcookie
            {
                position: fixed;
                z-index: 2147483645;
                left: 0;
                right: 0;
                bottom: 0;
                transform: translateZ(0);
                transition: opacity 0.25s ease-in-out;                
            }
            .chefcookie--hidden
            {
                opacity:0;
                pointer-events:none;
            }
            .chefcookie--hidden .chefcookie__box
            {
                transform: scale(0.8);
            }
            .chefcookie__inner
            {
                width:100%;
                height:100%;
                text-align: center;
                white-space: nowrap;
                font-size: 0;
                overflow-y:auto;
                max-height:100vh;
            }
            .chefcookie__box
            {
                font-size: 15px;
                color:#595f60;
                line-height:1.6;
                width: 100%;
                margin: 0 auto;
                display: inline-block;
                vertical-align: middle;
                white-space: normal;
                border-radius: 0;
                padding-top: 3em;
                padding-bottom: 3em;
                padding-left: 3em;
                padding-right: 3em;
                text-align: left;
                transition: transform 0.25s ease-in-out;
            }
            .chefcookie__message
            {
                margin-bottom:1em;
                text-align:justify;
            }
            .chefcookie__message h2
            {
                margin-bottom:0.5em;
                font-size:2em;
                text-transform:uppercase;
                font-weight:700;
                text-align:left;
            }
            .chefcookie__message a
            {
                color:inherit;
                transition: all 0.25s ease-in-out;
            }
            .chefcookie__message a:hover
            {
                opacity:0.5;
            }
            .chefcookie__message a:active
            {
                opacity:0.1;
            }
            .chefcookie__buttons
            {
                margin-top:0.5em;
            }
            .chefcookie__button
            {
                padding: 1em 0.5em;
                border: 2px solid #595f60;
                font-weight: bold;
                display: block;
                color: inherit;
                text-decoration: none;
                transition: all 0.25s ease-in-out;
                text-transform: uppercase;
                float: left;
                min-width: 21em;
                text-align: center;
            }
            .chefcookie__button:hover
            {
                opacity:0.5;
            }
            .chefcookie__button:active
            {
                opacity:0.1;
            }
            .chefcookie__buttons:after
            {            
                clear:both;
                display:table;
                content:"";
            }
            .chefcookie__button--settings
            {
                margin-right:3em;
            }
            .chefcookie__button--accept
            {
                background-color:${this.config.color};
                border-color:transparent;
                color:#fff;
            }
            .chefcookie__settings-container
            {
                height:0;
                overflow:hidden;
                transition: height 0.1s ease-out;
            }
            .chefcookie__groups
            {
                list-style-type:none;
            }
            .chefcookie__groups:after
            {
                clear:both;
                display:table;
                content:"";
            }
            .chefcookie__group
            {
                float: left;
            }
            .chefcookie__group-title
            {
                float:left;
                width:70%;
                height: 1.66em;
                line-height: 1.66em;
                display: block;
                font-weight:bold;
                font-size:1.2em;
                text-transform:uppercase;
            }
            .chefcookie__label
            {
                cursor: pointer;
                display:block;
                width:100%;
                height:100%;
            }
            .chefcookie__group--hidden .chefcookie__label
            {
                cursor:default;
            }
            .chefcookie__group-checkbox
            {
                opacity: 0;
                position:absolute;
                display: block;
                pointer-events:none;
            }
            .chefcookie__group--hidden .chefcookie__group-checkbox-icon
            {
                display:none;
            }
            .chefcookie__group-checkbox-icon
            {
                line-height:2em;
                display: block;
                width: 4em;
                height: 2em;
                background-color: #fff;
                border: 2px solid #595f60;
                margin: 0;
                padding: 0;
                position: relative;
                border-radius: 2em;
                float: right;
            }
            .chefcookie__group-checkbox-icon:before
            {
                content: "0";
                position: absolute;
                top: 0;
                left: 45%;
                width: 50%;
                bottom: 0;
                transition: all 0.15s ease-in-out;
                text-align: center;
                font-weight: bold;
                color: #595f60;
            }
            .chefcookie__group-checkbox-icon:after
            {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                bottom: 0;
                box-shadow: 0 0 0px 1px #595f60;
                background-color: #595f60;
                transition: all 0.15s ease-in-out;
                border-radius: 50%;
            }
            .chefcookie__group-checkbox ~ *
            {
                opacity:0.5;
                transition: all 0.25s ease-in-out;
            }
            .chefcookie__group-checkbox:checked ~ *
            {
                opacity:1;
            }
            .chefcookie__group-checkbox:checked ~ .chefcookie__group-checkbox-icon:after
            {
                left:50%;
            }
            .chefcookie__group-checkbox:checked ~ .chefcookie__group-checkbox-icon:before
            {
                content: "";
                background-color: #595f60;
                top: 30%;
                bottom: 30%;
                left: 27%;
                width: 3px;
            }
            .chefcookie__group-description
            {
                width:100%;
                clear:both;
                padding-top:1em;
                display: block;
                font-size:0.9em;
                text-align:justify;
            }
            .chefcookie--overlay
            {
                top: 0;
                background-color: rgba(0, 0, 0, 0.75);
            }
            .chefcookie--overlay .chefcookie__inner:before
            {
                content: '';
                display: inline-block;
                height: 100%;
                vertical-align: middle;
            }
            .chefcookie--overlay .chefcookie__box
            {
                max-width: 60em;
                box-shadow: 0 1em 5em -0.5em #000;
                background-color: #fff;
            }
            .chefcookie--overlay .chefcookie__group
            {
                height: 13em;
                width: 48%;
                margin-bottom: 4%;
                margin-right: 4%;
                background-color: #f7f7f7;
                border: 1px solid #eee;
            }
            .chefcookie--overlay .chefcookie__group:nth-child(2n)
            {
                margin-right:0;
            }
            .chefcookie--overlay .chefcookie__label
            {
                padding: 1em 1.25em;
            }
            .chefcookie--bottombar
            {
                top: auto;
                background-color:#eee;
                box-shadow: 0 1em 5em -0.5em #000;
            }
            .chefcookie--bottombar .chefcookie__box
            {
                max-width: 1280px;
            }
            .chefcookie--bottombar .chefcookie__group
            {
                width: 22%;
                margin-right: 4%;
                margin-bottom: 40px;
                margin-top: 40px;
            }
            .chefcookie--bottombar .chefcookie__group:last-child
            {
                margin-right:0;
            }
            @media screen and (max-width: 768px)
            {
                .chefcookie__box
                {
                    padding:1em;
                }
                .chefcookie__message h2
                {
                    font-size:1.5em;
                }
                .chefcookie__button
                {
                    float: none;
                    margin: 0 0 1em;
                    text-align: center;
                    width: 100%;
                    min-width:0;
                }
                .chefcookie .chefcookie__group,
                .chefcookie--overlay .chefcookie__group,
                .chefcookie--bottombar .chefcookie__group
                {
                    float:none;
                    margin-right:0;
                    width:100%;
                    height:auto;
                }
            }
        </style>
        `);
    }

    buildDom()
    {
        document.body.insertAdjacentHTML('beforeend',`
            <div class="chefcookie chefcookie--${this.config.layout}">
                <div class="chefcookie__inner">
                    <div class="chefcookie__box">
                        <div class="chefcookie__message">${this.config.message}</div>
                        <div class="chefcookie__settings-container">
                            <ul class="chefcookie__groups">
                                ${this.config.settings.map((group,i) => `
                                    <li class="chefcookie__group${(group.hidden)?(` chefcookie__group--hidden`):(``)}">                                    
                                        <label class="chefcookie__label" for="chefcookie_group_${i}">
                                            <input${(group.hidden)?(` disabled="disabled"`):(``)} class="chefcookie__group-checkbox" id="chefcookie_group_${i}" type="checkbox" name="chefcookie_group[]" value="${i}"${(group.active)?(` checked="checked"`):(``)} />
                                            <span class="chefcookie__group-title">${group.title}</span>
                                            <span class="chefcookie__group-checkbox-icon"></span>                                                                                  
                                            <span class="chefcookie__group-description">${group.description}</span>
                                        </label>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="chefcookie__buttons">
                            <a href="#chefcookie__settings" class="chefcookie__button chefcookie__button--settings">${this.getLabel('settings_open')}</a>
                            <a href="#chefcookie__accept" class="chefcookie__button chefcookie__button--accept">${this.getLabel('accept')}</a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    getLabel(label)
    {
        if( this.config.labels[label] === undefined )
        {
            return '';
        }
        return this.config.labels[label];
    }

    bindButtons()
    {
        if( document.querySelector('a[href="#chefcookie__decline"]') !== null )
        {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__decline"]'), (el) =>
            {
                el.addEventListener('click', (e) =>
                {
                    this.uncheckAllOptIns();
                    this.saveInCookie();
                    this.hideOverlay();
                    this.updateOptOut();
                    e.preventDefault();
                });
            });
        }
        if( document.querySelector('a[href="#chefcookie__accept"]') !== null )
        {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__accept"]'), (el) =>
            {
                el.addEventListener('click', (e) =>
                {
                    if( !this.settingsVisible() )
                    {
                        this.checkAllOptIns();
                    }
                    this.saveInCookie();
                    this.addEnabledScripts();
                    this.hideOverlay();
                    this.updateOptOut();
                    e.preventDefault();
                });
            });
        }
        if( document.querySelector('a[href="#chefcookie__settings"]') !== null )
        {
            [].forEach.call(document.querySelectorAll('a[href="#chefcookie__settings"]'), (el) =>
            {
                el.addEventListener('click', (e) =>
                {
                    if( !this.settingsVisible() )
                    {
                        this.showSettings();
                        this.switchLabelsOpen();
                    }
                    else
                    {
                        this.hideSettings();
                        this.switchLabelsClose();
                    }
                    e.preventDefault();
                });
            });
        }
    }

    switchLabelsOpen()
    {
        document.querySelector('.chefcookie__button--settings').textContent = this.getLabel('settings_close');
    }

    switchLabelsClose()
    {
        document.querySelector('.chefcookie__button--settings').textContent = this.getLabel('settings_open');
    }

    checkAllOptIns()
    {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), (el) =>
        {
            el.checked = true;
        });
    }

    uncheckAllOptIns()
    {
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), (el) =>
        {
            el.checked = false;
        });
    }

    saveInCookie()
    {
        let providers = [];
        [].forEach.call(document.querySelectorAll('.chefcookie__group-checkbox'), (el) =>
        {
            if( el.checked === true )
            {
                if( this.config.settings[el.value].trackers !== undefined )
                {
                    Object.entries(this.config.settings[el.value].trackers).forEach(([trackers__key, trackers__value]) =>
                    {
                        providers.push(trackers__key);
                    });   
                }             
            }
        });
        if( providers.length === 0 )
        {
            providers.push('null');
        }
        providers.join(',');
        helper.cookieSet('chefcookie', providers, 30);
    }

    addToCookie(provider)
    {
        let providers;
        if( !helper.cookieExists('chefcookie') || helper.cookieGet('chefcookie') === 'null' )
        {
            providers = [];
        }
        else
        {
            providers = helper.cookieGet('chefcookie').split(',');
        }
        if( providers.indexOf(provider) === -1 )
        {
            providers.push(provider);
            helper.cookieSet('chefcookie', providers.join(','), 30);
        }        
    }

    deleteFromCookie(provider)
    {
        if( !helper.cookieExists('chefcookie') )
        {
            return;
        }
        let providers = helper.cookieGet('chefcookie').split(',');
        let index = providers.indexOf(provider);
        if(index !== -1)
        {
            providers.splice(index, 1);
        }
        if( providers.length > 0 )
        {
            helper.cookieSet('chefcookie', providers.join(','), 30);
        }
        else
        {
            helper.cookieSet('chefcookie', 'null', 30);
        }
    }
    
    addEnabledScripts()
    {
        if( !helper.cookieExists('chefcookie') )
        {
            return;
        }
        let settings = helper.cookieGet('chefcookie');
        if( settings == 'null' )
        {
            return;
        }
        settings = settings.split(',');
        this.config.settings.forEach((settings__value) =>
        {
            if( settings__value.trackers !== undefined )
            {
                Object.entries(settings__value.trackers).forEach(([trackers__key, trackers__value]) =>
                {
                    if( settings.indexOf(trackers__key) === -1 )
                    {
                        return; 
                    }
                    this.addScript(trackers__key, trackers__value);
                });  
            }          
        });
    }

    addAllProvidersToCookie()
    {
        let providers = [];
        this.config.settings.forEach((settings__value) =>
        {
            if( settings__value.trackers !== undefined )
            {
                Object.entries(settings__value.trackers).forEach(([trackers__key, trackers__value]) =>
                {
                    providers.push(trackers__key);
                });  
            }          
        });        
        providers.join(',');
        helper.cookieSet('chefcookie', providers, 30);
    }

    addScript(provider, id)
    {
        var script;

        if( provider === 'google' )
        {
            script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id='+id;
            document.head.appendChild(script);
            script = document.createElement('script');
            script.innerHTML = 'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag(\'js\', new Date()); gtag(\'config\', \''+id+'\'); gtag(\'config\', \''+id+'\', { \'anonymize_ip\': true });';
            document.head.appendChild(script);
        }

        if( provider === 'facebook' )
        {
            script = document.createElement('script');
            script.innerHTML = '!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,\'script\',\'https://connect.facebook.net/en_US/fbevents.js\');fbq(\'init\', \''+id+'\');fbq(\'track\', \'PageView\');fbq(\'track\', \'ViewContent\');';
            document.head.appendChild(script);
        }

        if( provider === 'twitter' )
        {
            script = document.createElement('script');
            script.src = '//platform.twitter.com/oct.js';
            document.head.appendChild(script);
        }

        if( provider === 'taboola' )
        {
            script = document.createElement('script');
            script.innerHTML = 'window._tfa = window._tfa || [];_tfa.push({ notify: \'action\',name: \'page_view\' });';
            document.head.appendChild(script);
            script = document.createElement('script');
            script.src = '//cdn.taboola.com/libtrc/'+id+'/tfa.js';
            document.head.appendChild(script);
        }

        if( provider === 'match2one' )
        {
            script = document.createElement('script');
            script.src = 'https://secure.adnxs.com/seg?add='+id+'&t=1';
            document.head.appendChild(script);
            script = document.createElement('script');
            script.innerHTML = 'window.m2o = true;';
            document.head.appendChild(script);
        }

        if( provider === 'smartlook' )
        {
            script = document.createElement('script');
            script.innerHTML = 'window.smartlook||(function(d) {var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName(\'head\')[0];var c=d.createElement(\'script\');o.api=new Array();c.async=true;c.type=\'text/javascript\';c.charset=\'utf-8\';c.src=\'https://rec.smartlook.com/recorder.js\';h.appendChild(c);})(document);smartlook(\'init\', \''+id+'\');';
            document.head.appendChild(script);
        }

        if( provider === 'custom' )
        {
            id();
        }

        console.log('added script '+provider);
    }

    isEnabled(provider)
    {
        if( !helper.cookieExists('chefcookie') )
        {
            return false;       
        }
        return helper.cookieGet('chefcookie').split(',').indexOf(provider) > -1;
    }

    hideOverlay()
    {
        document.querySelector('.chefcookie').classList.add('chefcookie--hidden');
        setTimeout(() =>
        {
            document.body.removeChild(document.querySelector('.chefcookie'));
        },2000);
    }

    settingsVisible()
    {
        return document.querySelector('.chefcookie__settings-container').classList.contains('chefcookie__settings-container--visible');
    }

    showSettings()
    {
        document.querySelector('.chefcookie__settings-container').classList.add('chefcookie__settings-container--visible');
        document.querySelector('.chefcookie__settings-container').style.height = document.querySelector('.chefcookie__settings-container').scrollHeight+'px';
    }

    hideSettings()
    {
        document.querySelector('.chefcookie__settings-container').classList.remove('chefcookie__settings-container--visible');
        document.querySelector('.chefcookie__settings-container').style.height = 0;
    }

    eventGoogle(category, action)
    {
        if( !this.isEnabled('google') )
        {
            return;
        }
        if( typeof gtag != 'function' )
        {
            return;
        }
        if( action === undefined )
        {
            gtag('event', category);
            console.log('google '+category);
        }
        else
        {
            gtag('event', action, { 'event_category': category });
            console.log('google '+category+' '+action);
        }
    }

    eventFacebook(action)
    {
        if( !this.isEnabled('facebook') )
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

    eventTwitter(action)
    {
        if( !this.isEnabled('twitter') )
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

    eventTaboola(action)
    {
        if( !this.isEnabled('taboola') )
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

    eventMatch2one(id)
    {
        if( !this.isEnabled('match2one') )
        {
            return;
        }
        if( typeof m2o == 'undefined' )
        {
            return;
        }
        let script = document.createElement('script');
            script.src = 'https://secure.adnxs.com/px?'+id+'&t=1';
        document.head.appendChild(script);
        console.log('match2one '+id);
    }

    trackDuration()
    {
        var _this = this,
            timer = 30;
        while((timer/60) <= 8)
        {
            (function(timer)
            {
                window.setTimeout(function()
                {
                    _this.eventGoogle('duration_time', timer+'s');
                },timer*1000);
            })(timer);
            timer += 30;
        }
    }

    trackScrollDepth()
    {
        var scrollDepthTriggered = { 1: false, 10: false, 25: false, 50: false, 75: false, 100: false };
        this.eventGoogle('scroll_depth', '0%');
        window.addEventListener('scroll', () =>
        {
            let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
                documentHeight = Math.max(document.body.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight, document.documentElement.scrollHeight),
                windowHeight = window.innerHeight,
                scroll = Math.round((scrollTop/(documentHeight-windowHeight))*100);
            for(var scrollDepthTriggered__key in scrollDepthTriggered)
            {
                if(scrollDepthTriggered[scrollDepthTriggered__key] === false && scroll >= scrollDepthTriggered__key)
                {
                    scrollDepthTriggered[scrollDepthTriggered__key] = true;
                    this.eventGoogle('scroll_depth', scrollDepthTriggered__key+'%');
                }
            };
        });
    }

}

window.chefcookie = chefcookie;