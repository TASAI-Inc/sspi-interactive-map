<!-- note need to test this wordpress menu crawler 08-30-2023-->

<!--  
    
Create and assign your menu in the WordPress admin panel:
Go to Appearance > Menus.

Create a new menu and add the necessary menu items (Home, About, Contact, History, Gallery).

Assign the menu to the "Bootstrap 4 Menu" location.
With these steps, your custom WordPress menu should be integrated into the Bootstrap 4.6 Navbar, with dropdown functionality. 
Make sure you have Bootstrap properly enqueued in your theme for the styles and JavaScript to work correctly. 
You might need to adjust styles and classes based on your specific design and requirements.

-->


<!-- todo functions.php -->
<?php
function register_custom_menu() {
register_nav_menu('bootstrap-menu', __('Bootstrap Menu'));
}
add_action('init', 'register_custom_menu');
?>

<!-- todo header.php -->
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <!-- Head content here -->
</head>

<body <?php body_class(); ?>>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">Your Brand</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <?php
            wp_nav_menu(array(
                'theme_location' => 'bootstrap-menu',
                'container_class' => 'collapse navbar-collapse',
                'container_id'    => 'navbarNav',
                'menu_class'      => 'navbar-nav ml-auto',
                'fallback_cb'     => false,
                'depth'           => 2,
                'walker'          => new Bootstrap_Nav_Walker(),
            ));
            ?>
        </div>
    </nav>


    <!--  todo bootstrap-nav-walker.php-->
    <?php
// Function to generate the Bootstrap navigation menu
class Custom_Nav_Walker extends Walker_Nav_Menu
{
    // Customize the start level (submenu) output
    public function start_lvl(&$output, $depth = 0, $args = null)
    {
        $indent = str_repeat("\t", $depth);
        $output .= "\n$indent<ul class=\"dropdown-menu bg-white text-left dropdown-menu-left\" aria-labelledby=\"navbarDropdown\">\n";
    }

    // Customize the menu item output
    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0)
    {
        $indent = ($depth) ? str_repeat("\t", $depth) : '';

        // Add 'nav-item' class to menu items
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = 'nav-item';

        // Check if the menu item has children
        if ($depth === 0 && in_array('menu-item-has-children', $item->classes)) {
            $classes[] = 'menu-item-has-children';
        }

        $output .= $indent . '<li id="menu-item-' . $item->ID . '" class="dropdown' . esc_attr(implode(' ', $classes)) . '">';

        // Output the menu link
        // $output .= '<a href="' . esc_url($item->url) . '" class="nav-link' . ($depth === 0 && in_array('menu-item-has-children', $item->classes) ? ' dropdown-toggle' : '') . '"';
        $output .= '<a href="' . esc_url($item->url) . '" class="nav-link' . ($depth === 0 && in_array('menu-item-has-children', $item->classes) ? ' dropdown-toggle' : '') . '" title="' . esc_attr($item->title) . '"';



        // If the menu item has children, add Bootstrap attributes
        if ($depth === 0 && in_array('menu-item-has-children', $item->classes)) {
            $output .= ' data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"';
        }

        $output .= '>';
        $output .= apply_filters('the_title', $item->title, $item->ID);
        $output .= '</a>';
    }

    // Customize the end level (submenu) output
    public function end_lvl(&$output, $depth = 0, $args = null)
    {
        $output .= str_repeat("\t", $depth) . "</ul>\n";
    }

    // Customize the end menu item output
    public function end_el(&$output, $item, $depth = 0, $args = null)
    {
        $output .= "</li>\n";
    }
}
