export default class helper {
    static cookieExists(cookie_name) {
        if (document.cookie !== undefined && this.cookieGet(cookie_name) !== null) {
            return true;
        }
        return false;
    }

    static cookieGet(cookie_name) {
        var cookie_match = document.cookie.match(new RegExp(cookie_name + '=([^;]+)'));
        if (cookie_match) {
            return cookie_match[1];
        }
        return null;
    }

    static cookieSet(cookie_name, cookie_value, days) {
        let samesite = '';
        if (window.location.protocol.indexOf('https') > -1) {
            samesite = '; SameSite=None; Secure';
        }
        document.cookie =
            cookie_name +
            '=' +
            cookie_value +
            '; ' +
            'expires=' +
            new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toUTCString() +
            '; path=/' +
            samesite +
            '; domain=' +
            this.urlHostTopLevel();
    }

    static cookieDelete(cookie_name) {
        let samesite = '';
        if (window.location.protocol.indexOf('https') > -1) {
            samesite = '; SameSite=None; Secure';
        }
        document.cookie =
            cookie_name +
            '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' +
            samesite +
            '; domain=' +
            this.urlHostTopLevel();
    }

    static getParam(variable) {
        let url = window.location.search;
        if (url == '') {
            return null;
        }
        let query = url.substring(1),
            vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable && pair[1] != '') {
                return pair[1];
            }
        }
        return null;
    }

    static urlHostTopLevel() {
        let host = window.location.hostname;
        host = host.split('.');
        while (host.length > 2) {
            host.shift();
        }
        host = host.join('.');
        return host;
    }
}
