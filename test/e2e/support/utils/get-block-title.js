/**
 * Returns a string containing the block title associated with the provided block name.
 * @param {string} blockName Block name.
 *
 * @return {Promise} Promise resolving with a string containing the block title.
 */
export async function getBlockTitle( blockName ) {
	return page.evaluate( ( _blockName ) => {
		return wp.data.select( 'core/blocks' ).getBlockType( _blockName ).title;
	}, blockName );
}
