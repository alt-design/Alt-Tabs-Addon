(function () {
    'use strict';

    if (typeof window.Statamic === 'undefined' || typeof window.Vue === 'undefined') {
        return;
    }

    var Statamic = window.Statamic;
    var h = window.Vue.h;

    var TabFieldtype = {
        props: ['name', 'data', 'config', 'meta', 'value'],
        computed: {
            label: function () {
                return (this.config && this.config.label) || (this.meta && this.meta.label) || '';
            },
            placement: function () {
                return (this.config && this.config.placement) || (this.meta && this.meta.placement) || 'left';
            },
            icon: function () {
                return (this.config && this.config.icon) || (this.meta && this.meta.icon) || '';
            }
        },
        render: function () {
            var children = [];
            if (this.icon) {
                // Vue 3 treats a string tag in h() as a native element, so 'ui-icon' would
                // render as an unknown element and stay empty. Resolve the real component.
                var UiIcon = window.Vue.resolveComponent('ui-icon');
                children.push(h('span', { class: 'alt-tabs-marker-icon' }, [
                    typeof UiIcon === 'string' ? null : h(UiIcon, { name: this.icon })
                ]));
            }
            return h('div', {
                class: 'alt-tabs-marker',
                'data-alt-tab-label': this.label,
                'data-alt-tab-placement': this.placement,
                'data-alt-tab-icon': this.icon || ''
            }, children);
        }
    };

    var TabIndexFieldtype = {
        props: ['value'],
        render: function () {
            return h('span', { class: 'alt-tabs-index' }, this.value || '');
        }
    };

    Statamic.$components.register('tab-fieldtype', TabFieldtype);
    Statamic.$components.register('tab-fieldtype-index', TabIndexFieldtype);

    var REORG_CLASS = 'alt-tabs-reorganised';
    var GROUP_DATA_ATTR = 'data-alt-tabs-group-id';
    var STORAGE_PREFIX = 'altTabs:';

    function uniqueId() {
        return 'alt-tabs-' + Math.random().toString(36).slice(2, 10);
    }

    function storageKey(labels) {
        return STORAGE_PREFIX + location.pathname + '|' + labels.join('>');
    }

    function readActive(labels) {
        try {
            var raw = sessionStorage.getItem(storageKey(labels));
            if (raw === null) return 0;
            var n = parseInt(raw, 10);
            return (isNaN(n) || n < 0 || n >= labels.length) ? 0 : n;
        } catch (e) { return 0; }
    }

    function writeActive(labels, idx) {
        try { sessionStorage.setItem(storageKey(labels), String(idx)); } catch (e) {}
    }

    // Walk up until we find the level where this marker sits alongside the OTHER markers —
    // that's the shared field list we need to split into tabs. Statamic wraps each field in
    // its own form-group, so we have to skip past any ancestor that only contains our own
    // marker, or every tab ends up with a bar of its own.
    function findContainer(markerEl) {
        var el = markerEl.parentElement;
        while (el && el !== document.body) {
            var children = el.children;
            var siblingMarker = false;
            for (var i = 0; i < children.length; i++) {
                var c = children[i];
                if (c === markerEl || (c.contains && c.contains(markerEl))) continue;
                if (c.classList && c.classList.contains('alt-tabs-marker')) { siblingMarker = true; break; }
                if (c.querySelector && c.querySelector('.alt-tabs-marker')) { siblingMarker = true; break; }
            }
            if (siblingMarker) return el;
            el = el.parentElement;
        }
        return markerEl.parentElement;
    }

    // Copy the marker's rendered icon into the tab button, and keep watching until the
    // async SVG turns up (giving up after a few seconds so we don't observe forever).
    function mirrorIcon(source, target) {
        var copy = function () {
            var svg = source.querySelector('svg');
            if (!svg) return false;
            // Clone the node rather than copying markup — nothing is parsed from a string.
            target.replaceChildren(svg.cloneNode(true));
            return true;
        };

        if (copy()) return;

        var observer = new MutationObserver(function () {
            if (copy()) observer.disconnect();
        });
        observer.observe(source, { childList: true, subtree: true });
        setTimeout(function () { observer.disconnect(); }, 5000);
    }

    function reorganise(container) {
        if (!container || container.dataset.altTabsProcessed === '1') return;

        var children = Array.prototype.slice.call(container.children);
        var markers = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child.querySelector && !child.classList) continue;
            var marker = (child.classList && child.classList.contains('alt-tabs-marker'))
                ? child
                : child.querySelector('.alt-tabs-marker');
            if (marker && child.contains(marker)) {
                markers.push({ wrapper: child, marker: marker, index: i });
            }
        }

        if (markers.length < 1) return;

        var groupId = uniqueId();
        container.dataset.altTabsProcessed = '1';
        container.setAttribute(GROUP_DATA_ATTR, groupId);
        container.classList.add(REORG_CLASS);

        var placement = markers[0].marker.getAttribute('data-alt-tab-placement') || 'left';
        container.classList.add('alt-tabs-placement-' + placement);

        var tabs = [];
        for (var m = 0; m < markers.length; m++) {
            var info = markers[m];
            var label = info.marker.getAttribute('data-alt-tab-label') || ('Tab ' + (m + 1));
            var iconEl = info.marker.querySelector('.alt-tabs-marker-icon');
            var endIndex = (m + 1 < markers.length) ? markers[m + 1].index : children.length;
            var fields = [];
            for (var j = info.index + 1; j < endIndex; j++) {
                fields.push(children[j]);
            }
            tabs.push({ label: label, iconEl: iconEl, wrapper: info.wrapper, fields: fields });
            info.wrapper.classList.add('alt-tabs-marker-wrapper');
        }

        var labels = tabs.map(function (t) { return t.label; });

        var bar = document.createElement('div');
        bar.className = 'alt-tabs-bar alt-tabs-bar-' + placement;
        bar.setAttribute('role', 'tablist');
        bar.setAttribute('aria-orientation', placement === 'left' ? 'vertical' : 'horizontal');

        var buttons = [];
        tabs.forEach(function (tab, idx) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'alt-tabs-button';
            btn.id = groupId + '-tab-' + idx;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('data-alt-tab-index', String(idx));

            if (tab.iconEl) {
                var iconHost = document.createElement('span');
                iconHost.className = 'alt-tabs-marker-icon alt-tabs-button-icon';
                iconHost.setAttribute('aria-hidden', 'true');
                btn.appendChild(iconHost);
                // ui-icon fetches its SVG asynchronously, so the marker's copy is usually
                // still empty when we get here. Mirror it now and again once it arrives.
                mirrorIcon(tab.iconEl, iconHost);
            }

            var labelSpan = document.createElement('span');
            labelSpan.className = 'alt-tabs-button-label';
            labelSpan.textContent = tab.label;
            btn.appendChild(labelSpan);

            // Each tab owns a set of sibling field wrappers rather than one panel element, so
            // point aria-controls at them collectively and mark each as a panel for the tab.
            var panelIds = [];
            tab.fields.forEach(function (f, fieldIdx) {
                if (!f || !f.setAttribute) return;
                var panelId = groupId + '-panel-' + idx + '-' + fieldIdx;
                if (!f.id) f.id = panelId;
                f.setAttribute('role', 'tabpanel');
                f.setAttribute('aria-labelledby', btn.id);
                panelIds.push(f.id);
            });
            if (panelIds.length) btn.setAttribute('aria-controls', panelIds.join(' '));

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                activateTab(idx, true);
            });

            // Roving tabindex — left/right (or up/down when placed left) move between tabs.
            btn.addEventListener('keydown', function (e) {
                var next = null;
                var forward = placement === 'left' ? 'ArrowDown' : 'ArrowRight';
                var back = placement === 'left' ? 'ArrowUp' : 'ArrowLeft';
                if (e.key === forward) next = (idx + 1) % tabs.length;
                else if (e.key === back) next = (idx - 1 + tabs.length) % tabs.length;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = tabs.length - 1;
                if (next === null) return;
                e.preventDefault();
                activateTab(next, true);
                buttons[next].focus();
            });

            buttons.push(btn);
            bar.appendChild(btn);
        });

        container.insertBefore(bar, markers[0].wrapper);

        function activateTab(activeIdx, persist) {
            tabs.forEach(function (tab, idx) {
                var isActive = idx === activeIdx;
                buttons[idx].classList.toggle('is-active', isActive);
                buttons[idx].setAttribute('aria-selected', isActive ? 'true' : 'false');
                buttons[idx].tabIndex = isActive ? 0 : -1;
                tab.fields.forEach(function (f) {
                    if (!f || !f.classList) return;
                    f.classList.toggle('alt-tabs-field-hidden', !isActive);
                });
            });
            if (persist) writeActive(labels, activeIdx);
            requestAnimationFrame(function () {
                try { window.dispatchEvent(new Event('resize')); } catch (e) {}
            });
        }

        activateTab(readActive(labels), false);

        // Statamic can re-render a set's fields in place (adding a row, toggling a condition),
        // which drops our markers but leaves the bar behind. Watch for that and rebuild.
        var selfHeal = new MutationObserver(function () {
            if (!container.isConnected) { selfHeal.disconnect(); return; }
            if (container.querySelector('.alt-tabs-marker')) return;
            selfHeal.disconnect();
            bar.remove();
            delete container.dataset.altTabsProcessed;
            container.classList.remove(REORG_CLASS, 'alt-tabs-placement-' + placement);
            container.removeAttribute(GROUP_DATA_ATTR);
            scheduleScan();
        });
        selfHeal.observe(container, { childList: true });
    }

    function scan() {
        var markers = document.querySelectorAll('.alt-tabs-marker');
        var seen = [];
        markers.forEach(function (marker) {
            var container = findContainer(marker);
            if (!container || seen.indexOf(container) !== -1) return;
            seen.push(container);
            if (container.dataset.altTabsProcessed === '1') return;
            reorganise(container);
        });
    }

    var scheduled = false;
    function scheduleScan() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            scan();
        });
    }

    var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var added = mutations[i].addedNodes;
            if (!added || !added.length) continue;
            for (var j = 0; j < added.length; j++) {
                var node = added[j];
                if (node.nodeType !== 1) continue;
                if ((node.classList && node.classList.contains('alt-tabs-marker')) ||
                    (node.querySelector && node.querySelector('.alt-tabs-marker'))) {
                    scheduleScan();
                    return;
                }
            }
        }
    });

    function start() {
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', start);
            return;
        }
        observer.observe(document.body, { childList: true, subtree: true });
        scheduleScan();
    }

    start();
    window.addEventListener('load', scheduleScan);
})();
