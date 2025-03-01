import { filter, first, merge, of, switchMap, tap } from 'rxjs';
/**
 * Track id updates of an entity and re-evaluation the query with the changed entity id.
 * Hint: Don't place the operator after other operators in the same pipeline as those will be skipped on
 * re-evaluation. Also, it can't be used with the selection operator, e.g <code>selectEntity(1, e => e.title)</code>
 * @param query The query from which the entity is selected.
 * @example
 *
 *   query.selectEntity(1).pipe(trackIdChanges(query)).subscribe(entity => { ... })
 *
 */
export function trackIdChanges(query) {
    return (source) => source.lift(new TrackIdChanges(query));
}
class TrackIdChanges {
    constructor(query) {
        this.query = query;
    }
    call(subscriber, source) {
        return source
            .pipe(first(), switchMap((entity) => {
            let currId = entity[this.query.__store__.config.idKey];
            let pending = false;
            return merge(of({ newId: undefined, oldId: currId, pending: false }), this.query.__store__.selectEntityIdChanges$).pipe(
            // the new id must differ form the old id
            filter((change) => change.oldId === currId), 
            // extract the current pending state of the id update
            tap((change) => (pending = change.pending)), 
            // only update the selection query if the id update is already applied to the store
            filter((change) => change.newId !== currId && !pending), 
            // build a selection query for the new entity id
            switchMap((change) => this.query
                .selectEntity((currId = change.newId || currId))
                // skip undefined value if pending.
                .pipe(filter(() => !pending))));
        }))
            .subscribe(subscriber);
    }
}
//# sourceMappingURL=trackIdChanges.js.map