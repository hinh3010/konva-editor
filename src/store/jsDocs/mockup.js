/**
 *
 * @typedef {Object} State
 *
 * @property {string} activeSide
 * @property {ObjectId|null} productIdActive
 * @property {string||null} campaignIdActive
 * @property {object|null} selectedLayer
 * @property {boolean} stageDrag
 * @property {Array<StageSide>} stageSides
 * @property {StageComponent} stageComponent
 */

/**
 *
 * @typedef {Object} StageComponent
 *
 * @property {number} scaleX
 * @property {number} scaleY
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 */

/**
 * Objects representing the stage sides for a mockup design.
 * @typedef {Object} StageSide
 *
 * @property {Background} background - The background image or color of the stage side.
 * @property {string} side - The name of the stage side.
 * @property {number} ratioDefault - The default aspect ratio for the stage side.
 * @property {string|number} campaignId - The ID of the campaign associated with the stage side.
 * @property {ObjectId} productId - The ID of the product associated with the stage side.
 * @property {Array<object>} [layers=[]] - An array of layers for the stage side.
 * @property {number} ratio - The aspect ratio for the stage side.
 * @property {Array} [history=[]] - The history of .
 * @property {Area} area - The area
 * @property {Area} artwork - The artwork
 * @property {Element|null} stageRef
 */

/**
 * @typedef {Object} LayerImage
 */

/**
 * Area for the stage side
 * @typedef {Object} Background
 *
 * @property {string} src - The source of the background image.
 * @property {number} x - The x-coordinate of the background position.
 * @property {number} y - The y-coordinate of the background position.
 * @property {number} width - The width of the background image or color.
 * @property {number} height - The height of the background image or color.
 * @property {string} layerType - The type of layer for the background (e.g. "image", "color").
 * @property {number} rotation - The degree of rotation for the background.
 * @property {number} scale - The scale factor for the background.
 * @property {string} fill - The fill color for the background.
 */

/**
 * Area for the stage side
 * @typedef {Object} Area
 *
 * @property {string} side - The name of the stage side.
 * @property {string} src - The source of the stage side.
 */

/**
 * An object representing an image.
 * @typedef {Object} ImageObject
 * @property {string} url - The source URL of the image.
 * @property {string} name - The name of the image.
 * @property {any} size - The size of the image.
 * @property {string} type - The type of the image.
 * @property {number} width - The width of the image.
 * @property {number} height - The height of the image.
 */

/**
 *
 * @typedef {Object} Ratio
 *
 * @property {number} ratio
 * @property {number|undefined} ratioDefault
 */

/**
 * @typedef {object} History
 * @property
 */
