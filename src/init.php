<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function recent_posts_cgb_block_assets() { // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'recent_posts-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'recent_posts-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'recent_posts-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'recent_posts-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-recent-posts', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'recent_posts-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'recent_posts-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'recent_posts-cgb-block-editor-css',
			'render_callback' => 'recent_posts_block'
		)
	);
}

function recent_posts_block($attributes){
	if ( is_admin() ) {
        return '';
    }else{
    	$query_args = array(
	    'post_type' 		=> $attributes['SelectedPostType'],
	    'posts_per_page' 	=> $attributes['postperpage'],
	    'orderby' 			=> 'title',
    	'order'   			=> $attributes['Order'],
		);
		$popular_post_query = new WP_Query( $query_args );

		if ( $popular_post_query->have_posts() ) :
		    while ( $popular_post_query->have_posts() ) : $popular_post_query->the_post();

				?>
				<div class="post">
					<h2><a href="<?php the_permalink( ); ?>"><?php the_title(); ?></a></h2>
					<?php
					if(has_post_thumbnail()){
						echo get_the_post_thumbnail(get_the_ID(), $attributes['imagesize']);
					}
					echo ($attributes['postcontent']) ? get_the_excerpt() : '';
					echo ($attributes['postdate']) ? '<a href="'.get_the_permalink( ).'"><span>'.get_the_date('F j, Y',get_the_ID()).'</span></a>' : '';
					?>
				</div>
				<?php
		    endwhile;
		endif;
    }
	?>
	<?php
	wp_reset_postdata();
}
// Hook: Block assets.
add_action( 'init', 'recent_posts_cgb_block_assets' );
