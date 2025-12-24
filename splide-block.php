<?php

/**
 * Plugin Name: Splide Block
 * Description: Splideスライドショー・カルーセルブロック
 * Version: 1.3.0
 * Author: Nagaoka Design Office
 * Author URI: https://nag-design.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: splide-block
 */

if (!defined('ABSPATH')) {
    exit;
}

// REST APIエンドポイントの登録
function splide_block_register_rest_routes()
{
    // プリセット一覧の取得
    register_rest_route('splide-block/v1', '/presets', array(
        'methods' => 'GET',
        'callback' => 'splide_block_get_presets',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    // プリセットの保存
    register_rest_route('splide-block/v1', '/presets', array(
        'methods' => 'POST',
        'callback' => 'splide_block_save_preset',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));

    // プリセットの削除
    register_rest_route('splide-block/v1', '/presets/(?P<id>.+)', array(
        'methods' => 'DELETE',
        'callback' => 'splide_block_delete_preset',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));
}
add_action('rest_api_init', 'splide_block_register_rest_routes');

// プリセット一覧を取得
function splide_block_get_presets()
{
    $presets = get_option('splide_block_presets', array());
    return rest_ensure_response($presets);
}

// プリセットを保存
function splide_block_save_preset($request)
{
    $params = $request->get_json_params();
    $preset_name = sanitize_text_field($params['name']);
    $preset_settings = $params['settings'];

    if (empty($preset_name)) {
        return new WP_Error('invalid_name', 'プリセット名が必要です', array('status' => 400));
    }

    $presets = get_option('splide_block_presets', array());

    // プリセットIDをタイムスタンプベースで生成（確実にユニーク）
    $preset_id = 'preset_' . time() . '_' . wp_generate_password(6, false);

    $presets[$preset_id] = array(
        'name' => $preset_name,
        'settings' => $preset_settings,
        'created_at' => current_time('mysql')
    );

    update_option('splide_block_presets', $presets);

    return rest_ensure_response(array(
        'success' => true,
        'preset_id' => $preset_id,
        'message' => 'プリセットを保存しました'
    ));
}

// プリセットを削除
function splide_block_delete_preset($request)
{
    $preset_id = $request['id'];
    $presets = get_option('splide_block_presets', array());

    if (!isset($presets[$preset_id])) {
        return new WP_Error('not_found', 'プリセットが見つかりません', array('status' => 404));
    }

    unset($presets[$preset_id]);
    update_option('splide_block_presets', $presets);

    return rest_ensure_response(array(
        'success' => true,
        'message' => 'プリセットを削除しました'
    ));
}

// ブロックの登録
function splide_block_register()
{
    // エディター用スクリプト
    wp_register_script(
        'splide-block-editor',
        plugins_url('build/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
        false
    );

    // エディター用スタイル
    wp_register_style(
        'splide-block-editor',
        plugins_url('build/index.css', __FILE__),
        array('wp-edit-blocks'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.css')
    );

    // ブロックの登録
    register_block_type('custom/splide-block', array(
        'editor_script' => 'splide-block-editor',
        'editor_style' => 'splide-block-editor',
    ));
}
add_action('init', 'splide_block_register');

// フロントエンドでスクリプトをエンキュー
function splide_block_enqueue_frontend()
{
    if (is_singular() && has_block('custom/splide-block')) {
        // 投稿コンテンツからcssMode設定を取得
        $post = get_post();
        $css_mode = 'standard'; // デフォルト
        if ($post && preg_match('/data-cssmode="([^"]+)"/', $post->post_content, $matches)) {
            $css_mode = $matches[1];
        }

        // Splideが既に読み込まれていなければ読み込む
        if (!wp_script_is('splide', 'enqueued') && !wp_script_is('splide-js', 'enqueued')) {
            // CSS読み込み（cssModeに応じて）
            if ($css_mode === 'core') {
                wp_enqueue_style('splide-css', plugins_url('assets/css/splide-core.min.css', __FILE__), array(), '4.1.4');
            } elseif ($css_mode === 'standard') {
                wp_enqueue_style('splide-css', plugins_url('assets/css/splide.min.css', __FILE__), array(), '4.1.4');
            }
            // $css_mode === 'none' の場合は何も読み込まない

            wp_enqueue_script('splide-js', plugins_url('assets/js/splide.min.js', __FILE__), array(), '4.1.4', true);
        }

        // キャプションと画像のスタイルを追加（CSSが読み込まれている場合のみ）
        if ($css_mode !== 'none' && wp_style_is('splide-css', 'enqueued')) {
            wp_add_inline_style('splide-css', '
            .splide__slide {
                position: relative;
            }
            .splide__slide-caption {
                position: absolute;
                top: 0;
                left: 0;
                color: white;
                background-color: rgba(0, 0, 0, 0.8);
                padding: 0.25em 0.5em;
                font-size: 1rem;
                margin: 0;
                max-width: 100%;
                box-sizing: border-box;
            }
        ');
        }

        // 画像のスタイルを追加（動的にobject-fitを適用）
        wp_add_inline_script('splide-js', '
            document.addEventListener("DOMContentLoaded", function() {
                document.querySelectorAll(".splide").forEach(function(element) {
                    var objectFit = element.dataset.objectfit || "cover";
                    element.querySelectorAll(".splide__slide img").forEach(function(img) {
                        img.style.display = "block";
                        img.style.width = "100%";
                        img.style.height = "100%";
                        img.style.objectFit = objectFit;
                    });
                });
            });
        ', 'before');

        // 初期化スクリプト
        wp_add_inline_script('splide-js', '
            console.log("Splide初期化スクリプト読み込み");
            document.addEventListener("DOMContentLoaded", function() {
                console.log("DOM読み込み完了");
                var splideElements = document.querySelectorAll(".splide");
                console.log("Splide要素数:", splideElements.length);
                
                splideElements.forEach(function(element) {
                    var options = {
                        type: element.dataset.type || "loop",
                        autoplay: element.dataset.autoplay === "true",
                        interval: parseInt(element.dataset.interval) || 3000,
                        perPage: parseInt(element.dataset.perpage) || 1,
                        gap: element.dataset.gap || "1rem",
                        padding: element.dataset.padding || 0,
                        arrows: element.dataset.arrows !== "false",
                        pagination: element.dataset.pagination !== "false",
                        speed: parseInt(element.dataset.speed) || 400,
                        rewind: element.dataset.rewind === "true",
                        drag: element.dataset.drag !== "false",
                        keyboard: element.dataset.keyboard === "true"
                    };
                    
                    if (element.dataset.height) {
                        options.height = element.dataset.height;
                    }
                    if (element.dataset.heightratio) {
                        options.heightRatio = parseFloat(element.dataset.heightratio);
                    }
                    if (element.dataset.fixedwidth) {
                        options.fixedWidth = element.dataset.fixedwidth;
                    }
                    if (element.dataset.fixedheight) {
                        options.fixedHeight = element.dataset.fixedheight;
                    }
                    
                    if (element.dataset.breakpoints) {
                        options.breakpoints = JSON.parse(element.dataset.breakpoints);
                    }
                    
                    if (element.dataset.mediaquery) {
                        options.mediaQuery = element.dataset.mediaquery;
                    }
                    
                    console.log("Splide初期化:", options);
                    new Splide(element, options).mount();
                });
            });
        ');
    }
}
add_action('wp_enqueue_scripts', 'splide_block_enqueue_frontend');
