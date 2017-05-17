import CausalityRedux from 'causality-redux'
import {CAUSALITY_CHAIN_STATE} from '../state-partitions/partitions.js'
//
// The two functions below will disclose the causality chain operation from CAUSALITY_CHAIN_STATE.
//
function onStateChange(arg) {
    if ( arg.partitionName == CAUSALITY_CHAIN_STATE )
        console.log(`State Change: ${arg.type}.`);
}

function onListener(arg) {
    if ( arg.partitionName == CAUSALITY_CHAIN_STATE )
        console.log(`Listener: ${arg.listenerName}.`);
}

CausalityRedux.createStore(undefined, undefined, undefined, {onStateChange, onListener});

