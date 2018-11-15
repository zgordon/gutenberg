/**
 * Internal dependencies
 */
import {
	resetAutosave,
} from './actions';
import { apiFetch } from './controls';

/**
 * Request autosave data from the REST API.
 *
 * @param {string} postId The Post to retrieve the autosave for.
 */
export function* getAutosave( postId ) {
	const autosaveResponse = yield apiFetch( { path: `/wp/v2/posts/${ postId }/autosaves?context=edit` } );
	if ( autosaveResponse && autosaveResponse[ 0 ] ) {
		yield resetAutosave( autosaveResponse[ 0 ] );
	}
}
