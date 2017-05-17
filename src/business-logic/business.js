import CausalityRedux from 'causality-redux'
import {CAUSALITY_CHAIN_STATE} from '../state-partitions/partitions.js'

//
// Business logic for CAUSALITY_CHAIN_STATE
//
(function(){
    
    var Http = (function () {
        var errorMsg = 'Unknown network error.';

        function internalCallback(evt) {
            this.req = null;
            if (evt.target.status != 200) {
                if ( typeof this._errorCallback == 'function' )
                    this._errorCallback(errorMsg);
                return ;
            }
            this._callback(JSON.parse(evt.target.response));
        }

        function Http() {
            this.req = null;
            this._callback;
            this._errorCallback;
        }

        Http.prototype = {
            constructor: Http,
            
            get: function(url, callback, errorCallback) {
                this._callback = callback;
                this._errorCallback = errorCallback;
                var req = new XMLHttpRequest();
                req.open( "GET", url, true );
                req.addEventListener("load", internalCallback.bind(this), false);
                req.addEventListener("error", function() {this.req = null; errorCallback(errorMsg)}, false);
                req.send( null );
                this.req = req ;
            },
            abort: function () {
                if ( this.req )
                    this.req.abort();
                this.req = null;
            }
        }

        return (Http);
    })();

    function causalityChainInit() {
        var handlingGet = false ;
        var url = "https://jsonplaceholder.typicode.com/todos";
        var chain = CausalityRedux.store[CAUSALITY_CHAIN_STATE];
        var httpReq = null;
        
        function endRequest() {
            httpReq = null;
            chain.spinnerOff();
            handlingGet = false ;
        }
        
        function handleGetReceived(arg) {
            if ( !handlingGet )
                return ;
            endRequest();
            chain.onSetData(arg);    
        }
        
        function handleError(msg) {
            handleAbort();
            chain.setError(msg);
        }
        
        function handleGet() {
            if ( handlingGet )
                return ;
            handlingGet = true ;
            chain.spinnerOn();
            // Add extra time to allow an abort
            httpReq = new Http();
            httpReq.get(url, function(args) {setTimeout(handleGetReceived, 2000, args)}, handleError);
        }
        
        function handleAbort() {
            if ( handlingGet ) {
                if ( httpReq )
                    httpReq.abort();
                endRequest();
            }
        }
        
        //
        // Subscribe to the 2 states values, onGet and onAbortGet
        // Then whenever the changer onGet is called by the UI, the handleGet function will be called.
        // The third parameter is used only for tracking the 'handleGet' call with the onListener function..
        //
        chain.subscribe(handleGet, ['onGet'], 'handleGet') ;
        chain.subscribe(handleAbort, ['onAbortGet'], 'handleAbort') ;
    };
    
    if ( typeof CausalityRedux == 'undefined' )
        throw new Error('CausalityRedux is not defined.');
    //
    // causalityChainInit will be called aftre CausalityRedux.createStore has completed
    // installing all of the partitions including the causalityChain partition.
    // Until that happens, CausalityRedux.store[CAUSALITY_CHAIN_STATE] will not be defined.
    // So, install a lister that will be called when CausalityRedux.createStore has finished.
    //
    CausalityRedux.onStoreCreated(causalityChainInit);
})();
