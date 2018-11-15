/**
 * WordPress Dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import controls from './controls';
import applyMiddlewares from './middlewares';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';

/**
 * Module Constants
 */
const MODULE_KEY = 'core/editor';

const store = registerStore( MODULE_KEY, {
	reducer,
	controls,
	selectors,
	actions,
	resolvers,
	persist: [ 'preferences' ],
} );
applyMiddlewares( store );

export default store;
