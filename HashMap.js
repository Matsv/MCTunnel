(function (m) {
    function k() {
        this.entries = {};
        this.length = 0
    }

    function g(b) {
        if (!b)return 0;
        var a = b.toString.hash;
        if (void 0 !== a)return a;
        a = (typeof b).charAt(0);
        if ("s" == a)for (var c = a = 0; c < b.length; c++)a = 31 * a + 2 * b.charCodeAt(c); else if ("n" == a)a = b; else if ("b" == a)a = b ? 1231 : 1237; else if ("o" == a && b)for (c in a = 0, b) {
            if (b.hasOwnProperty(c))var d = b[c], a = a * g(c) + g(d)
        } else a = 0;
        return b.toString.hash = a
    }

    var l = {}, e = k.prototype;
    e.get = function (b) {
        var a = g(b);
        if (a = this.entries[a])for (var c = a.length; c--;) {
            var d = a[c];
            if (d.key === b)return d.value
        }
    };
    e.put = function (b, a) {
        var c = g(b), d = this.entries[c], h = {key: b, value: a};
        if (d) {
            for (var f = d.length; f--;) {
                var e = d[f];
                if (e.key === b)return h = e.value, a == l ? 1 < d.length ? d.splice(f, 1) : this.entries[c] = null : e.value = a, h
            }
            d.push(h)
        } else this.entries[c] = [h];
        this.length++
    };
    e.remove = function (b) {
        return this.put(b, l)
    };
    e.toArray = function () {
        var b = [], a;
        for (a in this.entries)if (this.entries.hasOwnProperty(a))for (var c = this.entries[a], d = 0, e = c.length; d < e; d++) {
            var f = c[d];
            f && b.push(f.value)
        }
        return b
    };
    "undefined" != typeof module ? module.exports = k : m.HashMap = k
})(this);