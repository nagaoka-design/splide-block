import { registerBlockType } from '@wordpress/blocks';
import { MediaUpload, MediaUploadCheck, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, RangeControl, SelectControl, TextControl, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

registerBlockType('custom/splide-block', {
    title: __('Splideスライドショー', 'splide-block'),
    icon: 'images-alt2',
    category: 'media',
    attributes: {
        images: {
            type: 'array',
            default: []
        },
        autoplay: {
            type: 'boolean',
            default: true
        },
        interval: {
            type: 'number',
            default: 3000
        },
        type: {
            type: 'string',
            default: 'loop'
        },
        perPage: {
            type: 'number',
            default: 1
        },
        // レスポンシブ設定
        mediaQuery: {
            type: 'string',
            default: 'max'
        },
        perPageTablet: {
            type: 'number',
            default: 2
        },
        perPageMobile: {
            type: 'number',
            default: 1
        },
        breakpointTablet: {
            type: 'number',
            default: 768
        },
        breakpointMobile: {
            type: 'number',
            default: 480
        },
        // サイズ設定
        height: {
            type: 'string',
            default: ''
        },
        heightRatio: {
            type: 'number',
            default: 0
        },
        heightRatioTablet: {
            type: 'number',
            default: 0
        },
        heightRatioMobile: {
            type: 'number',
            default: 0
        },
        fixedWidth: {
            type: 'string',
            default: ''
        },
        fixedHeight: {
            type: 'string',
            default: ''
        },
        fixedWidthTablet: {
            type: 'string',
            default: ''
        },
        fixedHeightTablet: {
            type: 'string',
            default: ''
        },
        fixedWidthMobile: {
            type: 'string',
            default: ''
        },
        fixedHeightMobile: {
            type: 'string',
            default: ''
        },
        // よく使うオプション
        gap: {
            type: 'string',
            default: '1rem'
        },
        padding: {
            type: 'string',
            default: '0'
        },
        arrows: {
            type: 'boolean',
            default: true
        },
        pagination: {
            type: 'boolean',
            default: true
        },
        speed: {
            type: 'number',
            default: 400
        },
        rewind: {
            type: 'boolean',
            default: false
        },
        drag: {
            type: 'boolean',
            default: true
        },
        keyboard: {
            type: 'boolean',
            default: false
        },
        objectFit: {
            type: 'string',
            default: 'cover'
        },
        cssMode: {
            type: 'string',
            default: 'standard'
        }
    },

    edit: (props) => {
        const { attributes, setAttributes } = props;
        const {
            images, autoplay, interval, type, perPage, mediaQuery,
            perPageTablet, perPageMobile, breakpointTablet, breakpointMobile,
            height, heightRatio, heightRatioTablet, heightRatioMobile, fixedWidth, fixedHeight,
            fixedWidthTablet, fixedHeightTablet, fixedWidthMobile, fixedHeightMobile,
            gap, padding, arrows, pagination, speed, rewind, drag, keyboard,
            objectFit, cssMode
        } = attributes;

        const onSelectImages = (media) => {
            setAttributes({
                images: media.map(item => ({
                    id: item.id,
                    url: item.url,
                    alt: item.alt || '',
                    caption: item.caption || ''
                }))
            });
        };

        const removeImage = (index) => {
            const newImages = [...images];
            newImages.splice(index, 1);
            setAttributes({ images: newImages });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('基本設定', 'splide-block')} initialOpen={true}>
                        <SelectControl
                            label={__('タイプ', 'splide-block')}
                            value={type}
                            options={[
                                { label: 'ループ', value: 'loop' },
                                { label: 'スライド', value: 'slide' },
                                { label: 'フェード', value: 'fade' }
                            ]}
                            onChange={(value) => setAttributes({ type: value })}
                        />
                        <ToggleControl
                            label={__('自動再生', 'splide-block')}
                            checked={autoplay}
                            onChange={(value) => setAttributes({ autoplay: value })}
                        />
                        {autoplay && (
                            <RangeControl
                                label={__('間隔（ミリ秒）', 'splide-block')}
                                value={interval}
                                onChange={(value) => setAttributes({ interval: value })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                        )}
                        <RangeControl
                            label={__('スライド速度（ミリ秒）', 'splide-block')}
                            value={speed}
                            onChange={(value) => setAttributes({ speed: value })}
                            min={100}
                            max={2000}
                            step={100}
                        />
                        <SelectControl
                            label={__('CSSの読み込み', 'splide-block')}
                            value={cssMode}
                            options={[
                                { label: '標準CSS（デフォルトスタイル付き）', value: 'standard' },
                                { label: 'コアCSS（最小限、カスタマイズ前提）', value: 'core' },
                                { label: 'なし（自分で読み込む/完全カスタム）', value: 'none' }
                            ]}
                            onChange={(value) => setAttributes({ cssMode: value })}
                            help="標準CSS=splide.min.css、コアCSS=splide-core.min.css"
                        />
                    </PanelBody>

                    <PanelBody title={__('レスポンシブ設定', 'splide-block')} initialOpen={false}>
                        <RadioControl
                            label={__('レスポンシブモード', 'splide-block')}
                            selected={mediaQuery}
                            options={[
                                { label: 'デスクトップファースト（max-width）', value: 'max' },
                                { label: 'モバイルファースト（min-width）', value: 'min' }
                            ]}
                            onChange={(value) => setAttributes({ mediaQuery: value })}
                            help={
                                mediaQuery === 'max'
                                    ? 'デフォルト設定が最も広い画面用になります。ブレークポイントは「◯◯px以下」の意味です。'
                                    : 'デフォルト設定が最も狭い画面用になります。ブレークポイントは「◯◯px以上」の意味です。'
                            }
                        />

                        <hr style={{ margin: '20px 0' }} />

                        {/* デスクトップファースト（max-width）の場合: PC → タブレット → モバイル */}
                        {/* モバイルファースト（min-width）の場合: モバイル → タブレット → PC */}
                        {mediaQuery === 'max' ? (
                            <>
                                <h3>{__('PC設定（デフォルト）', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPage}
                                    onChange={(value) => setAttributes({ perPage: value })}
                                    min={1}
                                    max={6}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatio}
                                    onChange={(value) => setAttributes({ heightRatio: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効。0.5625 = 16:9, 1 = 正方形, 1.7778 = 9:16"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidth}
                                    onChange={(value) => setAttributes({ fixedWidth: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeight}
                                    onChange={(value) => setAttributes({ fixedHeight: value })}
                                    help="例: 200px"
                                />

                                <hr style={{ margin: '20px 0' }} />

                                <h3>{__('タブレット設定', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('ブレークポイント（px以下）', 'splide-block')}
                                    value={breakpointTablet}
                                    onChange={(value) => setAttributes({ breakpointTablet: value })}
                                    min={600}
                                    max={1200}
                                    step={1}
                                />
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPageTablet}
                                    onChange={(value) => setAttributes({ perPageTablet: value })}
                                    min={1}
                                    max={5}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatioTablet}
                                    onChange={(value) => setAttributes({ heightRatioTablet: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidthTablet}
                                    onChange={(value) => setAttributes({ fixedWidthTablet: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeightTablet}
                                    onChange={(value) => setAttributes({ fixedHeightTablet: value })}
                                    help="例: 200px"
                                />

                                <hr style={{ margin: '20px 0' }} />

                                <h3>{__('モバイル設定', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('ブレークポイント（px以下）', 'splide-block')}
                                    value={breakpointMobile}
                                    onChange={(value) => setAttributes({ breakpointMobile: value })}
                                    min={320}
                                    max={800}
                                    step={1}
                                />
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPageMobile}
                                    onChange={(value) => setAttributes({ perPageMobile: value })}
                                    min={1}
                                    max={3}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatioMobile}
                                    onChange={(value) => setAttributes({ heightRatioMobile: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidthMobile}
                                    onChange={(value) => setAttributes({ fixedWidthMobile: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeightMobile}
                                    onChange={(value) => setAttributes({ fixedHeightMobile: value })}
                                    help="例: 200px"
                                />
                            </>
                        ) : (
                            <>
                                <h3>{__('モバイル設定（デフォルト）', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPageMobile}
                                    onChange={(value) => setAttributes({ perPageMobile: value })}
                                    min={1}
                                    max={3}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatioMobile}
                                    onChange={(value) => setAttributes({ heightRatioMobile: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidthMobile}
                                    onChange={(value) => setAttributes({ fixedWidthMobile: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeightMobile}
                                    onChange={(value) => setAttributes({ fixedHeightMobile: value })}
                                    help="例: 200px"
                                />

                                <hr style={{ margin: '20px 0' }} />

                                <h3>{__('タブレット設定', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('ブレークポイント（px以上）', 'splide-block')}
                                    value={breakpointMobile}
                                    onChange={(value) => setAttributes({ breakpointMobile: value })}
                                    min={320}
                                    max={800}
                                    step={1}
                                />
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPageTablet}
                                    onChange={(value) => setAttributes({ perPageTablet: value })}
                                    min={1}
                                    max={5}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatioTablet}
                                    onChange={(value) => setAttributes({ heightRatioTablet: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidthTablet}
                                    onChange={(value) => setAttributes({ fixedWidthTablet: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeightTablet}
                                    onChange={(value) => setAttributes({ fixedHeightTablet: value })}
                                    help="例: 200px"
                                />

                                <hr style={{ margin: '20px 0' }} />

                                <h3>{__('PC設定', 'splide-block')}</h3>
                                <RangeControl
                                    label={__('ブレークポイント（px以上）', 'splide-block')}
                                    value={breakpointTablet}
                                    onChange={(value) => setAttributes({ breakpointTablet: value })}
                                    min={600}
                                    max={1200}
                                    step={1}
                                />
                                <RangeControl
                                    label={__('表示枚数', 'splide-block')}
                                    value={perPage}
                                    onChange={(value) => setAttributes({ perPage: value })}
                                    min={1}
                                    max={6}
                                />
                                <RangeControl
                                    label={__('高さ比率（heightRatio）', 'splide-block')}
                                    value={heightRatio}
                                    onChange={(value) => setAttributes({ heightRatio: value })}
                                    min={0}
                                    max={3}
                                    step={0.0001}
                                    help="0の場合は無効。0.5625 = 16:9, 1 = 正方形, 1.7778 = 9:16"
                                />
                                <TextControl
                                    label={__('スライドの幅（個別）', 'splide-block')}
                                    value={fixedWidth}
                                    onChange={(value) => setAttributes({ fixedWidth: value })}
                                    help="例: 300px"
                                />
                                <TextControl
                                    label={__('スライドの高さ（個別）', 'splide-block')}
                                    value={fixedHeight}
                                    onChange={(value) => setAttributes({ fixedHeight: value })}
                                    help="例: 200px"
                                />
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('サイズ設定', 'splide-block')} initialOpen={false}>
                        <SelectControl
                            label={__('画像の表示方法', 'splide-block')}
                            value={objectFit}
                            options={[
                                { label: 'カバー（切り抜き）', value: 'cover' },
                                { label: '全体表示（余白あり）', value: 'contain' }
                            ]}
                            onChange={(value) => setAttributes({ objectFit: value })}
                        />
                        <TextControl
                            label={__('スライダーの高さ（全体）', 'splide-block')}
                            value={height}
                            onChange={(value) => setAttributes({ height: value })}
                            help="例: 400px, 50vh。空欄の場合は画像の高さに自動調整"
                        />
                        {/* heightRatioは削除 */}
                        <TextControl
                            label={__('スライドの幅（個別）', 'splide-block')}
                            value={fixedWidth}
                            onChange={(value) => setAttributes({ fixedWidth: value })}
                            help="例: 300px。すべてのスライドを同じ幅に固定"
                        />
                        <TextControl
                            label={__('スライドの高さ（個別）', 'splide-block')}
                            value={fixedHeight}
                            onChange={(value) => setAttributes({ fixedHeight: value })}
                            help="例: 200px。すべてのスライドを同じ高さに固定"
                        />
                    </PanelBody>

                    <PanelBody title={__('スペース設定', 'splide-block')} initialOpen={false}>
                        <TextControl
                            label={__('スライド間の余白（gap）', 'splide-block')}
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                            help="例: 1rem, 20px"
                        />
                        <TextControl
                            label={__('左右の余白（padding）', 'splide-block')}
                            value={padding}
                            onChange={(value) => setAttributes({ padding: value })}
                            help="例: 2rem, 5%"
                        />
                    </PanelBody>

                    <PanelBody title={__('表示オプション', 'splide-block')} initialOpen={false}>
                        <ToggleControl
                            label={__('矢印を表示', 'splide-block')}
                            checked={arrows}
                            onChange={(value) => setAttributes({ arrows: value })}
                        />
                        <ToggleControl
                            label={__('ページネーションを表示', 'splide-block')}
                            checked={pagination}
                            onChange={(value) => setAttributes({ pagination: value })}
                        />
                        <ToggleControl
                            label={__('最後から最初に戻る（rewind）', 'splide-block')}
                            checked={rewind}
                            onChange={(value) => setAttributes({ rewind: value })}
                        />
                        <ToggleControl
                            label={__('ドラッグを有効化', 'splide-block')}
                            checked={drag}
                            onChange={(value) => setAttributes({ drag: value })}
                        />
                        <ToggleControl
                            label={__('キーボード操作を有効化', 'splide-block')}
                            checked={keyboard}
                            onChange={(value) => setAttributes({ keyboard: value })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="splide-block-editor">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple
                            gallery
                            value={images.map(img => img.id)}
                            render={({ open }) => (
                                <Button
                                    onClick={open}
                                    variant="primary"
                                    className="splide-block-upload-button"
                                >
                                    {images.length === 0
                                        ? __('画像を選択', 'splide-block')
                                        : __('画像を変更', 'splide-block')
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>

                    {images.length > 0 && (
                        <div className="splide-block-preview">
                            <p>選択された画像: {images.length}枚</p>
                            {images.map((image, index) => (
                                <div key={index} className="splide-block-image-item">
                                    <img src={image.url} alt={image.alt} />
                                    <TextControl
                                        label={__('キャプション', 'splide-block')}
                                        value={image.caption || ''}
                                        onChange={(value) => {
                                            const newImages = [...images];
                                            newImages[index] = { ...newImages[index], caption: value };
                                            setAttributes({ images: newImages });
                                        }}
                                        placeholder="キャプションを入力（任意）"
                                    />
                                    <Button
                                        onClick={() => removeImage(index)}
                                        isDestructive
                                        isSmall
                                    >
                                        削除
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    },

    save: (props) => {
        const { attributes } = props;
        const {
            images, autoplay, interval, type, perPage, mediaQuery,
            perPageTablet, perPageMobile, breakpointTablet, breakpointMobile,
            height, heightRatio, heightRatioTablet, heightRatioMobile, fixedWidth, fixedHeight,
            fixedWidthTablet, fixedHeightTablet, fixedWidthMobile, fixedHeightMobile,
            gap, padding, arrows, pagination, speed, rewind, drag, keyboard,
            objectFit, cssMode
        } = attributes;

        if (images.length === 0) {
            return null;
        }

        // レスポンシブ設定をJSONで作成
        const breakpoints = {};

        if (mediaQuery === 'max') {
            // デスクトップファースト（max-width）
            // デフォルト = PC設定（perPage）
            // breakpointTablet以下 = タブレット設定（perPageTablet）
            // breakpointMobile以下 = モバイル設定（perPageMobile）
            if (breakpointTablet > 0) {
                breakpoints[breakpointTablet] = {
                    perPage: perPageTablet
                };
                if (heightRatioTablet > 0) {
                    breakpoints[breakpointTablet].heightRatio = heightRatioTablet;
                }
                if (fixedWidthTablet) {
                    breakpoints[breakpointTablet].fixedWidth = fixedWidthTablet;
                }
                if (fixedHeightTablet) {
                    breakpoints[breakpointTablet].fixedHeight = fixedHeightTablet;
                }
            }
            if (breakpointMobile > 0) {
                breakpoints[breakpointMobile] = {
                    perPage: perPageMobile
                };
                if (heightRatioMobile > 0) {
                    breakpoints[breakpointMobile].heightRatio = heightRatioMobile;
                }
                if (fixedWidthMobile) {
                    breakpoints[breakpointMobile].fixedWidth = fixedWidthMobile;
                }
                if (fixedHeightMobile) {
                    breakpoints[breakpointMobile].fixedHeight = fixedHeightMobile;
                }
            }
        } else {
            // モバイルファースト（min-width）
            // デフォルト = モバイル設定（perPageMobile）
            // breakpointMobile以上 = タブレット設定（perPageTablet）
            // breakpointTablet以上 = PC設定（perPage）
            if (breakpointMobile > 0) {
                breakpoints[breakpointMobile] = {
                    perPage: perPageTablet
                };
                if (heightRatioTablet > 0) {
                    breakpoints[breakpointMobile].heightRatio = heightRatioTablet;
                }
                if (fixedWidthTablet) {
                    breakpoints[breakpointMobile].fixedWidth = fixedWidthTablet;
                }
                if (fixedHeightTablet) {
                    breakpoints[breakpointMobile].fixedHeight = fixedHeightTablet;
                }
            }
            if (breakpointTablet > 0) {
                breakpoints[breakpointTablet] = {
                    perPage: perPage
                };
                if (heightRatio > 0) {
                    breakpoints[breakpointTablet].heightRatio = heightRatio;
                }
                if (fixedWidth) {
                    breakpoints[breakpointTablet].fixedWidth = fixedWidth;
                }
                if (fixedHeight) {
                    breakpoints[breakpointTablet].fixedHeight = fixedHeight;
                }
            }
        }

        return (
            <div
                className="splide"
                data-type={type}
                data-autoplay={autoplay}
                data-interval={interval}
                data-perpage={mediaQuery === 'max' ? perPage : perPageMobile}
                data-mediaquery={mediaQuery}
                data-gap={gap}
                data-padding={padding}
                data-arrows={arrows}
                data-pagination={pagination}
                data-speed={speed}
                data-rewind={rewind}
                data-drag={drag}
                data-keyboard={keyboard}
                data-height={height}
                data-heightratio={mediaQuery === 'max' ? (heightRatio > 0 ? heightRatio : '') : (heightRatioMobile > 0 ? heightRatioMobile : '')}
                data-fixedwidth={mediaQuery === 'max' ? fixedWidth : fixedWidthMobile}
                data-fixedheight={mediaQuery === 'max' ? fixedHeight : fixedHeightMobile}
                data-objectfit={objectFit}
                data-cssmode={cssMode}
                data-breakpoints={Object.keys(breakpoints).length > 0 ? JSON.stringify(breakpoints) : ''}
            >
                <div className="splide__track">
                    <ul className="splide__list">
                        {images.map((image, index) => (
                            <li key={index} className="splide__slide">
                                <img src={image.url} alt={image.alt} />
                                {image.caption && (
                                    <div className="splide__slide-caption">
                                        {image.caption}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
});