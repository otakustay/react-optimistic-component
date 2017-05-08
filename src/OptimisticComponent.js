import {PureComponent} from 'react';

let noPatchStateInOptimistic = 'You can only call setState with function if the component is in optimistic state';

export default class OptimisticComponent extends PureComponent {
    stateSavePoint = null;

    stateModifications = [];

    saveModificationOnDemand(input) {
        if (this.stateSavePoint) {
            this.stateModifications.push(input);
        }
    }

    setState(patch, callback, transactionId) {
        if (this.stateSavePoint) {
            if (typeof patch !== 'function') {
                throw new Error(noPatchStateInOptimistic);
            }
        }
        else if (transactionId) {
            this.stateSavePoint = this.state;
        }

        this.saveModificationOnDemand({patch, transactionId});

        super.setState(patch, callback);
    }

    rollbackOptimistic(rollbackTransactionId) {
        let modifications = this.stateModifications.slice();
        let [newState, stateSavePoint, stateModifications] = modifications.reduce(
            ([newState, savePoint, modifications], next) => {
                let {patch, transactionId} = next;

                if (transactionId === rollbackTransactionId) {
                    return [newState, savePoint, modifications];
                }

                if (transactionId && !savePoint) {
                    savePoint = newState;
                }

                if (savePoint) {
                    modifications.push(next);
                }

                let stateChange = patch(newState);
                newState = Object.assign({}, newState, stateChange);

                return [newState, savePoint, modifications];
            },
            [this.stateSavePoint, null, []]
        );
        this.stateSavePoint = null;
        this.setState(newState);
        this.stateSavePoint = stateSavePoint;
        this.stateModifications = stateModifications;
    }
}
