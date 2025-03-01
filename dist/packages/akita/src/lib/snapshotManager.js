import { filter, take } from 'rxjs';
import { $$addStore } from './dispatchers';
import { isString } from './isString';
import { setSkipStorageUpdate } from './persistState';
import { __stores__ } from './stores';
export class SnapshotManager {
    /**
     * Get a snapshot of the whole state or a specific stores
     * Use it ONLY for things such as saving the state in the server
     */
    getStoresSnapshot(stores = []) {
        const acc = {};
        const hasInclude = stores.length > 0;
        const keys = hasInclude ? stores : Object.keys(__stores__);
        for (let i = 0; i < keys.length; i++) {
            const storeName = keys[i];
            if (storeName !== 'router') {
                acc[storeName] = __stores__[storeName]._value();
            }
        }
        return acc;
    }
    setStoresSnapshot(stores, options) {
        const mergedOptions = { ...{ skipStorageUpdate: false, lazy: false }, ...options };
        mergedOptions.skipStorageUpdate && setSkipStorageUpdate(true);
        let normalizedStores = stores;
        if (isString(stores)) {
            normalizedStores = JSON.parse(normalizedStores);
        }
        const size = Object.keys(normalizedStores).length;
        if (mergedOptions.lazy) {
            $$addStore
                .pipe(filter((name) => normalizedStores.hasOwnProperty(name)), take(size))
                .subscribe((name) => __stores__[name]._setState(() => normalizedStores[name]));
        }
        else {
            for (let i = 0, keys = Object.keys(normalizedStores); i < keys.length; i++) {
                const storeName = keys[i];
                if (__stores__[storeName]) {
                    __stores__[storeName]._setState(() => normalizedStores[storeName]);
                }
            }
        }
        mergedOptions.skipStorageUpdate && setSkipStorageUpdate(false);
    }
}
export const snapshotManager = new SnapshotManager();
//# sourceMappingURL=snapshotManager.js.map