/**
 * BLOCK: recent-posts
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const {
    RichText,
    URLInput,
    InspectorControls,
    ColorPalette,
} = wp.editor;
const { PanelBody, IconButton, RangeControl, FontSizePicker, SelectControl, ToggleControl } = wp.components;
const { Fragment } = wp.element;
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-recent-posts', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Recent Posts' ), // Block title.
	description: __('Display a list of your most recent posts including custom post types.'),
	icon: 'admin-page', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'widgets', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'recent-posts — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		"SelectedPostType": {
            "type": "string"
        },
        "PostType": {
            "type": "object"
        },
        "postperpage": {
            "type": "number"
        },
        "Order": {
            "type": "string"
        },
        "postdate": {
            "type": "string"
        },
        "postcontent": {
            "type": "string"
        },
        "imagesize": {
            "type": "string"
        }
    },
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {
		if(!props.attributes.PostType){
            wp.apiFetch({
                url:'/gutenberg-demo/wp-json/wp/v2/types'
            }).then( PostType => {
                props.setAttributes( { 
                    PostType: PostType
                } )
            });
        }
        
		function updatePost(e){
			props.setAttributes({
				SelectedPostType: e.target.value,
			});
		}
		return (
			<Fragment>
				<InspectorControls>
	                <PanelBody title={ 'Parameter Settings' }>
	                    <RangeControl
	                        value={ props.attributes.postperpage }
	                        label={ 'Number of posts' }
	                        min={ 0 }
	                        max={ 50 }
	                        initialPosition={ 5 }
	                        allowReset
	                        onChange={ ( value ) => props.setAttributes( { postperpage: value } ) } />
	                    <SelectControl
					        label="Order By"
					        value={ props.attributes.Order }
					        options={ [
					            { label: 'Ascending', value: 'ASC' },
					            { label: 'Descending', value: 'DESC' },
					        ] }
					        onChange={ ( value ) => props.setAttributes( { Order: value } ) }
					    />
	                </PanelBody>
	                <PanelBody title={ 'Post Meta Settings' }>
					    <ToggleControl
					        label="Display Post Date"
					        checked= {props.attributes.postdate}
					        onChange={( value ) => props.setAttributes( { postdate: value } )}
					    />
	                </PanelBody>
	                <PanelBody title={ 'Post Excerpt Settings' }>
					    <ToggleControl
					        label="Display Post Excerpt"
					        checked= {props.attributes.postcontent}
					        onChange={( value ) => props.setAttributes( { postcontent: value } )}
					    />
	                </PanelBody>
	                <PanelBody title={ 'Image Settings' }>
					    <SelectControl
					        label="Image Size"
					        value={ props.attributes.imagesize }
					        options={ [
					            { label: 'Thumbnail', value: 'thumbnail' },
					            { label: 'Medium', value: 'medium' },
					            { label: 'Large', value: 'large' },
					            { label: 'Full', value: 'full' },
					        ] }
					        onChange={ ( value ) => props.setAttributes( { imagesize: value } ) }
					    />
	                </PanelBody>
	            </InspectorControls>
				<div>
					<p>Select Post Type</p>
					<select onChange={updatePost} value={props.attributes.SelectedPostType}>
					{
						Object.keys(props.attributes.PostType).map( Post => {
							return(
								<option value={Post} key={Post}>
									{Post}
								</option>
							)
						})
					}
					</select>
				</div>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {
		return null;
	},
} );
