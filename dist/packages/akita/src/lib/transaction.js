import { BehaviorSubject, of, Subject, tap } from 'rxjs';
import { logAction } from './actions';
// @internal
const transactionFinished = new Subject();
// @internal
const transactionInProcess = new BehaviorSubject(false);
// @internal
export const transactionManager = {
    activeTransactions: 0,
    batchTransaction: null,
};
// @internal
export function startBatch() {
    if (!isTransactionInProcess()) {
        transactionManager.batchTransaction = new Subject();
    }
    transactionManager.activeTransactions++;
    transactionInProcess.next(true);
}
// @internal
export function endBatch() {
    if (--transactionManager.activeTransactions === 0) {
        transactionManager.batchTransaction.next(true);
        transactionManager.batchTransaction.complete();
        transactionInProcess.next(false);
        transactionFinished.next(true);
    }
}
// @internal
export function isTransactionInProcess() {
    return transactionManager.activeTransactions > 0;
}
// @internal
export function commit() {
    return transactionManager.batchTransaction ? transactionManager.batchTransaction.asObservable() : of(true);
}
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *  The following code will update the store, BUT  emits only once
 *
 *  @example
 *  applyTransaction(() => {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  });
 *
 */
export function applyTransaction(action, thisArg = undefined) {
    startBatch();
    try {
        return action.apply(thisArg);
    }
    finally {
        logAction('@Transaction');
        endBatch();
    }
}
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *
 *  The following code will update the store, BUT  emits only once.
 *
 *  @example
 *  @transaction
 *  addTodos() {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  }
 *
 *
 */
export function transaction() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return applyTransaction(() => {
                return originalMethod.apply(this, args);
            }, this);
        };
        return descriptor;
    };
}
/**
 *
 * RxJS custom operator that wraps the callback inside transaction
 *
 * @example
 *
 * return http.get().pipe(
 *    withTransaction(response > {
 *      store.setActive(1);
 *      store.update();
 *      store.updateEntity(1, {});
 *    })
 * )
 *
 */
export function withTransaction(next) {
    return function (source) {
        return source.pipe(tap((value) => applyTransaction(() => next(value))));
    };
}
//# sourceMappingURL=transaction.js.map