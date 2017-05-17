import CausalityRedux from 'causality-redux'

// user defined changer
const onAddComment2 = (comment={author: "", text:''}) => {
    return {
        type: 'onAddComment2',
        comment
    }
}

// user defined reducer
const onAddComment2Reducer = (state, action) =>
    Object.assign({}, state, {items: [...state.items, action.comment]});
    

// Comment state entry
export const COMMENTS_STATE = "COMMENTS_STATE";
const reduxComments = {
    partitionName: COMMENTS_STATE,
    // No type checking of obj
    defaultState: {items:[], author:'', text: '', idToDelete:"", idToChange:"", authorToChange:"", nextIndex:"", obj:{}},
    changerDefinitions: {
        'onResetAuthorDefault': { operation : CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['author'] },
        'onAuthorChange': { arguments: ['author'] },
        'onTextChange': { arguments: ['text'] }, 
        'onObjectChange': { arguments: ['obj'] }, 
        'onIdChange': { arguments: ['idToDelete'] }, 
        'onIdChangeForChange': { arguments: ['idToChange'] },
        'onAuthorChangeForChange': { arguments: ['authorToChange'] },
        'onObjectMerge': { operation: CausalityRedux.operations.STATE_OBJECT_MERGE, arguments:['obj'] },  
        'onArrayChange': { arguments: ['items'] },         
        'onAddComment': { operation: CausalityRedux.operations.STATE_ARRAY_ADD, arrayName:'items', keyName:'id', keyIndexerName:'nextIndex', arrayArgShape:{author:'String', text:'String'} },   
        'onChangeComment': { operation: CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, arrayName:'items', keyName: 'id', arrayArgShape:{author:'String'} },
        'onDeleteComment': {  operation: CausalityRedux.operations.STATE_ARRAY_DELETE, arrayName:'items', keyName: 'id' }, 
        'onSetVideoUserDimensions': { operation: CausalityRedux.operations.STATE_ARRAY_ENTRY_MERGE, arrayName:'items', keyName: 'id'},
    },
    changers:   {
                    onAddComment2
                },
    reducers:   {
                    onAddComment2Reducer
                }           
}

 
export const COUNTER_STATE = "COUNTER_STATE";
const reduxCounter = {
    partitionName: COUNTER_STATE,
    defaultState: {counter: 0},
    changerDefinitions:{
        'onIncrement': { operation: CausalityRedux.operations.STATE_INCREMENT, impliedArguments: ['counter'] },
        'onDecrement': { operation: CausalityRedux.operations.STATE_DECREMENT, impliedArguments: ['counter'] } 
    }
}

//
// CausalityRedux partition for CAUSALITY_CHAIN_STATE
//
export const CAUSALITY_CHAIN_STATE = "CAUSALITY_CHAIN_STATE";
const causalityChain = {
    partitionName: CAUSALITY_CHAIN_STATE,
    defaultState: {data: [], spinnerCount:0, error:""},
    changerDefinitions: {
        'onGet':        { operation: CausalityRedux.operations.STATE_FUNCTION_CALL},
        'onAbortGet':   { operation: CausalityRedux.operations.STATE_FUNCTION_CALL},
        'setError':     { arguments:['error']},
        'clearError':   { operation : CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['error'] },
        'onSetData':    { operation: CausalityRedux.operations.STATE_COPY, arguments: ['data'] },
        'spinnerOn':    { operation: CausalityRedux.operations.STATE_INCREMENT, impliedArguments: ['spinnerCount'] },
        'spinnerOff':   { operation: CausalityRedux.operations.STATE_DECREMENT, impliedArguments: ['spinnerCount'] },
        'clear':        { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['data'] },        
    }
};

CausalityRedux.addPartitions([reduxComments, reduxCounter, causalityChain]);

