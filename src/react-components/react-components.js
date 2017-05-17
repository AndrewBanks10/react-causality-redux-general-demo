import React from 'react'
import ReactDOM from 'react-dom'
import CausalityRedux from 'causality-redux'
import 'react-causality-redux'
import {Provider} from 'react-redux'

import {COUNTER_STATE, COMMENTS_STATE, CAUSALITY_CHAIN_STATE} from '../state-partitions/partitions.js'


const Loader = ({spinnerCount}) => {
    let className = "";
    if ( spinnerCount > 0 )
        className = "loader";
    return (
        <div className={className}>
        </div>
    );
};
let LoaderCausalityRedux = CausalityRedux.connectStateToProps(Loader, CAUSALITY_CHAIN_STATE, ['spinnerCount'], 'LoaderCausalityRedux');

const ErrorMessage = ({error, clearError}) => {
    if ( error == "" )
        return(null);
    return (
        <div className={'center-div-on-screen error-message error-message-text'}>
            <div className={'error-message-text'}> {error}</div>
            <br/>
            <button onClick={ e=> clearError() }>OK</button>
        </div>
    );
}
let ErrorMessageCausalityRedux = CausalityRedux.connectChangersAndStateToProps(ErrorMessage, CAUSALITY_CHAIN_STATE, ['clearError'], ['error'], 'ErrorMessageCausalityRedux');
//
// React component (ChangeFormValueCausalityRedux) definition for CAUSALITY_CHAIN_STATE
//
const ChangeFormValue = ({onGet, onAbortGet, clear, data}) => {
    let tlist = data.map((o) => {
        return( 
            <tr key={o.id}>
                <td>{o.userId}</td>
                <td>{o.id}</td>
                <td>{o.title}</td>
                <td>{o.completed.toString()}</td>
            </tr>
        )
    });
    return(
        <div className='change-form'>
            <div className="change-form-text">
                {'Causality chain example.'}
            </div>
            <div className="table-container">
                <table>
                    <tbody>
                      <tr>
                        <th>User Id</th>
                        <th>Todo Id</th>
                        <th>Text</th>
                        <th>Completed</th>                       
                      </tr>
                      {tlist}
                    </tbody>
                </table>
            </div>
            <div className='ajax-button-container1'>
                <button className='form-button' onClick={e => onGet()}>Ajax Load</button>  
            </div>
            <div className='ajax-button-container1'>
                <button className='form-button' onClick={e => onAbortGet()}>Abort</button>  
            </div>                 
            <div className='ajax-button-container2'>
                <button className='form-button' onClick={e => clear()}>Clear</button>  
            </div>                  
            <LoaderCausalityRedux/>
        </div>
    );
}
//
// CausalityRedux.connectChangersAndStateToProps will bind, the "onGet", "clear" and "onAbortGet" changers that are in the partition 
// CAUSALITY_CHAIN_STATE to the props. Also bind the partition CAUSALITY_CHAIN_STATE value of 'data' to the props.
// This gives access to the function calls, "this.props.onGet", "this.props.clear" and "this.props.onAbortGet" for onClick events. It also gives access to "data" such that
// any changes to "data" will cause a render with the new value of data in this.props.data.
//
// Note that the react component ChangeFormValueCausalityRedux has no dependencies on the react UI tree other than being placed somewhere.
// Note also that this component did  not need to import in any business logic. All it needs from the outside is CausalityRedux and 
// the constant CAUSALITY_CHAIN_STATE. As a result, the component uses javascript only for the purpose of constructing the DOM and
// reacting to user clicks.
//
let ChangeFormValueCausalityRedux = CausalityRedux.connectChangersAndStateToProps(ChangeFormValue, CAUSALITY_CHAIN_STATE, ['onGet', 'clear', 'onAbortGet'], ['data'], 'ChangeFormValueCausalityRedux');


// Based on https://medium.com/front-end-developers/react-redux-tutorial-d1f6c6652759
let initialComments = [
    {author: "Cory Brown", text: "My 2 scents"},
    {author: "Jared Anderson", text: "Let me put it this way. You've heard of Socrates? Aristotle? Plato? Morons!"},
    {author: "Matt Poulson", text: "It's just a function!"},
    {author: "Bruce Campbell", text: "Fish in a tree? How can that be?"}
];

initialComments.forEach(comment => ( CausalityRedux.store[COMMENTS_STATE].onAddComment(comment) ) );

const Comment = ({author, children}) =>
    <div className="comment-entry">
        <div className="comment-list-author">
            { author }
        </div>
        <div className="comment-list-text">
            { children }
        </div>
    </div>


class CommentList extends React.Component {
    componentDidUpdate() {
        console.log('CommentList.componentDidUpdate renders only when the comment list changes.');
    }
    render() {
        return(
            <div className="comment-form-list-container">
                <div className='comment-text'>Comments</div>
                <div className="comment-form-list">
                    { this.props.items.map((comment) => (
                        <Comment author={ comment.author } key={comment.id} >
                            {`id: ${comment.id}, ${comment.text}` }
                        </Comment>
                    )) }
                </div>
            </div>               
        );
    }
}
let CommentListCausalityRedux = CausalityRedux.connectStateToProps(CommentList, COMMENTS_STATE, ['items']);

class CommentForm extends React.Component {
    componentDidMount(){
      this.nameInput.focus();
    }
    componentDidUpdate() {
        console.log('CommentForm.componentDidUpdate renders only when author or text changes.');
    }
    render() {
        const {onAddComment, onAuthorChange, onTextChange, author, text } = this.props;
        return(
            <div className="comment-form-delete">
                <div className='form-header'>Add Comment</div>
                <form 
                      onSubmit={ (e) => {
                          e.preventDefault();
                          onAddComment({author, text});
                          onAuthorChange( "" ); 
                          onTextChange("");                          
                      }}
                >
                    <input type="text"
                           ref={(input) => { this.nameInput = input; }} 
                           name="author"
                           required="required"
                           placeholder="Author"
                           value={ author }
                           onChange={ (e) => 
                               onAuthorChange(e.target.value) }
                    />
                    <input type="text"
                           name="text"
                           placeholder="Comment"
                           required="required"                           
                           value={ text }
                           onChange={ (e) => 
                               onTextChange(e.target.value) }
                    />
                    <button className='form-button'>Post</button>
     
                </form>
            </div>
        );
    }
}
let CommentFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentForm, COMMENTS_STATE, ['onAddComment', 'onAuthorChange', 'onTextChange'], ['author', 'text']);

class CommentBoxDeleteForm extends React.Component {
    componentDidUpdate() {
        console.log('CommentBoxDeleteForm.componentDidUpdate renders when idToDelete changes.');
    }
    render() {
        const {onDeleteComment, onIdChange, idToDelete } = this.props;
        return(
            <div className="comment-form-delete">
                <div className='form-header'>Delete Comment</div>           
                <form 
                      onSubmit={ (e) => {
                          e.preventDefault();
                          onDeleteComment(idToDelete);
                          onIdChange( "" );                     
                      }}
                >
                    <input type="text"
                           name="ID"
                           required="required"
                           value={ idToDelete }
                           placeholder="ID to delete"
                           onChange={ (e) => 
                               onIdChange( e.target.value ) }
                    />
                    <button className='form-button'>Delete</button>
                </form>
            </div>
        );
    }
}
let CommentBoxDeleteFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentBoxDeleteForm, COMMENTS_STATE, ['onDeleteComment', 'onIdChange'], ['idToDelete']);

class CommentBoxChangeForm extends React.Component {
    componentDidUpdate() {
        console.log('CommentBoxChangeForm.componentDidUpdate renders when idToChange or authorToChange changes.');
    }
    render() {
        const {onChangeComment, onIdChangeForChange, onAuthorChangeForChange, idToChange, authorToChange } = this.props;
        return(
            <div className="comment-form-change">
                <div className='form-header'>Change the Author in a Comment</div>            
                <form 
                      onSubmit={ (e) => {
                          e.preventDefault();
                          onChangeComment(idToChange, {author:authorToChange});
                          onIdChangeForChange( "" ); 
                          onAuthorChangeForChange("");                      
                      }}
                >
                    <input type="text"
                           name="ID"
                           required="required"
                           value={ idToChange }
                           placeholder="ID of entry"
                           onChange={ (e) => 
                               onIdChangeForChange( e.target.value ) }
                    />
                    <input type="text"
                           name="author"
                           required="required"
                           value={ authorToChange }
                           placeholder="Author"
                           onChange={ (e) => 
                               onAuthorChangeForChange(e.target.value) }
                    />                 
                    <button className='form-button'>Change</button>
                </form>
            </div>
        );
    }
}
let CommentBoxChangeFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CommentBoxChangeForm, COMMENTS_STATE, ['onChangeComment', 'onIdChangeForChange', 'onAuthorChangeForChange'], ['idToChange', 'authorToChange']);

const CommentBox = () =>
    <div className="comment-box">
        <CommentListCausalityRedux />
        <CommentFormCausalityRedux/>
        <CommentBoxDeleteFormCausalityRedux/>
        <CommentBoxChangeFormCausalityRedux/>
    </div>

const CounterFormValue = ({counter}) => 
    <div className='counter-form-value'>
        {`Counter Display: ${counter}`}
    </div>

//
// Create a smart react wrapper component based on the dumb component CounterFormValue.
// The CounterFormValue render function is called each time 'counter' is changed in COUNTER_STATE with the new value
// in props.counter
//
let CounterFormValueCausalityRedux = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter']);
let CounterFormValueCausalityRedux2 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter']);
let CounterFormValueCausalityRedux3 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter']);
let CounterFormValueCausalityRedux4 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter']);

class CounterForm extends React.Component {
    componentDidUpdate() {
        console.log('CounterForm.componentDidUpdate renders when counter changes.');
    }
    render() {
        return(
            <div className='counter-form'>
                <div className='counter-form-text'>Multiple child components are updated with one state change/event.</div>
                <CounterFormValueCausalityRedux />
                <CounterFormValueCausalityRedux2 />
                <CounterFormValueCausalityRedux3 />
                <CounterFormValueCausalityRedux4 /> 
                <div className='counter-form-button-container'>
                    <div className='counter-text'>{`The current counter is ${this.props.counter}.`}</div>
                    <div className='counter-form-button'>
                        <button onClick={ (e) => 
                            this.props.onIncrement() }>Up</button>
                    </div>  
                    <button onClick={ (e) => 
                        this.props.onDecrement()}>Down</button>
                </div>
            </div>        
        );
    }
}
//
// Create a smart react wrapper component based on the dumb component CounterForm.
// The CounterBoxCausalityRedux smart component will provide to CounterForm the onCounter function defined in COUNTER_STATE in props.onCounter.
// Each time the entry 'counter' in COUNTER_STATE is changed, the prop.counter is updated with the new value and then
// the render function is called for CounterForm to update the change.
//
let CounterFormCausalityRedux = CausalityRedux.connectChangersAndStateToProps(CounterForm, COUNTER_STATE, ['onIncrement', 'onDecrement'], ['counter']);

const App = () =>
    <Provider store={ CausalityRedux.store}>
        <div className='main-container'>
            <ErrorMessageCausalityRedux/>
            <ChangeFormValueCausalityRedux/>
            <CounterFormCausalityRedux/>
            <CommentBox/>
        </div>
    </Provider>

ReactDOM.render(
    <App/>,
    document.getElementById('reactroot')
);

