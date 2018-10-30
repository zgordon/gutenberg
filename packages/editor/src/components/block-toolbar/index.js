/**
 * WordPress Dependencies
 */
import { withSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import BlockSwitcher from '../block-switcher';
import MultiBlocksSwitcher from '../block-switcher/multi-blocks-switcher';
import BlockControls from '../block-controls';
import BlockFormatControls from '../block-format-controls';
import BlockSettingsMenu from '../block-settings-menu';
import NavigableToolbar from '../navigable-toolbar';

function BlockToolbar( { blockClientIds, isValid, mode } ) {
	if ( blockClientIds.length === 0 ) {
		return null;
	}

	const hasMultiSelection = blockClientIds.length > 1;

	let controls;
	if ( hasMultiSelection ) {
		controls = (
			<MultiBlocksSwitcher />
		);
	} else if ( mode === 'visual' && isValid ) {
		controls = (
			<Fragment>
				<BlockSwitcher clientIds={ blockClientIds } />
				<BlockControls.Slot />
				<BlockFormatControls.Slot />
			</Fragment>
		);
	}

	return (
		<NavigableToolbar
			className="editor-block-toolbar"
			aria-label={ __( 'Block Toolbar' ) }
			scopeId={ 'block-' + blockClientIds[ 0 ] }
		>
			{ controls }
			<BlockSettingsMenu clientIds={ blockClientIds } />
		</NavigableToolbar>
	);
}

export default withSelect( ( select ) => {
	const {
		getSelectedBlock,
		getBlockMode,
		getMultiSelectedBlockClientIds,
	} = select( 'core/editor' );
	const block = getSelectedBlock();
	const blockClientIds = block ?
		[ block.clientId ] :
		getMultiSelectedBlockClientIds();

	return {
		blockClientIds,
		isValid: block ? block.isValid : null,
		mode: block ? getBlockMode( block.clientId ) : null,
	};
} )( BlockToolbar );
