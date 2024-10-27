<?php
/*
Plugin Name: Amilia Button
Plugin URI: http://www.amilia.com/
Description: Add an Amilia button to a WordPress page or blog post.
Author: Martin Drapeau <martin.drapeau@amilia.com>
Copyright: 2014-2017 Amilia
Version: 1.0
Author URI: http://www.amilia.com/
License: Apache License 2.0
License URI: http://www.apache.org/licenses/LICENSE-2.0.html
Text Domain: amilia-button
*/

function amilia_button_load_plugin_textdomain() {
    load_plugin_textdomain( 'amilia_button' );
}
add_action( 'plugins_loaded', 'amilia_button_load_plugin_textdomain' );

function amilia_button_inject_localization_in_javascript() {
    global $current_screen;
    $type = $current_screen->post_type;

    if (is_admin() && $type == 'post' || $type == 'page') {
        $dict = array(
            "lang" => __("en", 'amilia-button'),
            "modal-title" => __("Button for Redirection to Amilia", 'amilia-button'),
            "url-label" => __("Store URL", 'amilia-button'),
            "insert" => __("Insert", 'amilia-button'),
            "update" => __("Update", 'amilia-button'),
            "delete" => __("Remove", 'amilia-button'),
            "close" => __("Close", 'amilia-button'),
            "text" => __("Button text", 'amilia-button'),
            "text-value" => __("Register online", 'amilia-button'),
            "image" => __("Image", 'amilia-button'),
            "color" => __("Color", 'amilia-button'),
            "g" => __("Green", 'amilia-button'),
            "dg" => __("Dark Green", 'amilia-button'),
            "b" => __("Blue", 'amilia-button'),
            "db" => __("Dark Blue", 'amilia-button'),
            "o" => __("Orange", 'amilia-button'),
            "r" => __("Red", 'amilia-button'),
            "y" => __("Yellow", 'amilia-button'),
            "steel" => __("Steel", 'amilia-button'),
            "check" => __("Check", 'amilia-button'),
            "edit" => __("Pencil", 'amilia-button'),
            "lock" => __("Lock", 'amilia-button'),
            "french" => __("French", 'amilia-button'),
            "english" => __("English", 'amilia-button'),
            "error-invalid-url" => __("Please enter a valid URL", 'amilia-button'),
            "error-invalid-text" => __("Please type in the button text", 'amilia-button'),
            "help" => __("Help", 'amilia-button'),
            "instructions" => __("Instructions", 'amilia-button'),
            "instructions-p1" => __("Navigate to the page of your store, or the registration page. Copie the URL from the address bar, and paste in the field URL.", 'amilia-button'),
            "instructions-p2" => __("Choose the color, the image and the text. Then insert the button on your page.", 'amilia-button'),
            "instructions-p3" => __("You can modify or remove it later, by positioning the cursor on the Amilia button. Click again on the Amilia tool icon.", 'amilia-button')
        );
        ?>
        <script type="text/javascript">window.objectL10n = <?=json_encode($dict)?></script>
        <?php
    }
}
add_action('admin_head', 'amilia_button_inject_localization_in_javascript');

function amilia_add_mce_button() {
    if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) return;
    if (get_user_option('rich_editing') == 'true') {
        add_filter('mce_external_plugins', 'amilia_add_tinymce_plugin');
        add_filter('mce_buttons', 'amilia_register_mce_button');
    }
}
add_action('admin_head', 'amilia_add_mce_button');

function amilia_add_tinymce_plugin($plugin_array) {
    $plugin_array['amilia_button'] = plugins_url('amilia-button.js', __FILE__);
    return $plugin_array;
}

function amilia_register_mce_button($buttons) {
    array_push($buttons, 'amilia_button');
    return $buttons;
}

?>