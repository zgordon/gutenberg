import { getAutosave } from '../resolvers';
import { resetAutosave } from '../actions';

describe( 'getAutosave', () => {
	const SUCCESSFUL_RESPONSE = [ {
		title: 'test title',
		excerpt: 'test excerpt',
		content: 'test content',
	} ];

	it( 'yields with fetched autosave post', async () => {
		const fulfillment = getAutosave( 1 );
		// Trigger generator
		fulfillment.next();
		// Provide apiFetch response and trigger Action
		const received = ( await fulfillment.next( SUCCESSFUL_RESPONSE ) ).value;
		expect( received ).toEqual( resetAutosave( SUCCESSFUL_RESPONSE[ 0 ] ) );
	} );

	it( 'yields undefined if no autosave existings for the post', async () => {
		const fulfillment = getAutosave( 1 );
		// Trigger generator
		fulfillment.next();
		// Provide apiFetch response and trigger Action
		const received = ( await fulfillment.next( [] ) ).value;
		expect( received ).toBeUndefined();
	} );
} );
