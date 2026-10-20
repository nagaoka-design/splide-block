<?php

/**
 * Plugin Name: Splide Block
 * Description: Splideスライドショー・カルーセルブロック
 * Version: 1.4.0
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

// ブロックの登録（block.json の editorScript / viewScript / style が自動で読み込まれる）
function splide_block_register()
{
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'splide_block_register');

// Splide本体のCSSは「ブロックごとの cssMode」に応じて、そのブロックが出力されたときだけ読み込む
// （JSはviewScriptにバンドル済みなので、テーマ側のSplideとは干渉しない）
function splide_block_enqueue_css($block_content, $block)
{
    if ('' === trim($block_content)) {
        return $block_content;
    }

    $css_mode = isset($block['attrs']['cssMode']) ? $block['attrs']['cssMode'] : 'standard';

    if ('core' === $css_mode) {
        wp_enqueue_style('splide-block-core', plugins_url('assets/css/splide-core.min.css', __FILE__), array(), '4.1.4');
    } elseif ('standard' === $css_mode) {
        wp_enqueue_style('splide-block-standard', plugins_url('assets/css/splide.min.css', __FILE__), array(), '4.1.4');
    }
    // 'none' の場合は何も読み込まない

    return $block_content;
}
add_filter('render_block_custom/splide-block', 'splide_block_enqueue_css', 10, 2);
