/**
 * Style templates for html5.styles
 *
 * @version: 0.9.1
 * @description Easy templates for 'excelStyles'
 * @file buttons.html5.styles.templates.js
 * @copyright © 2020 Beyond the Box Creative
 * @author Paul Jones <info@pauljones.co.nz>
 * @license MIT
 *
 * Include this file after including the buttons.html5.styles.js (along with the required DataTables dependencies)
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([
            'jquery',
            'datatables.net',
            'datatables.net-buttons',
            'datatables.net-buttons/js/buttons.html5.js',
            'datatables-buttons-excel-styles/js/buttons.html5.styles.js',
        ], function ($) {
            return factory($, window, document);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }

            if (!$.fn.dataTable.Buttons) {
                require('datatables.net-buttons')(root, $);
            }

            if (!$.fn.dataTable.Buttons.excelHtml5) {
                require('datatables.net-buttons/js/buttons.html5.js')(root, $);
            }

            if (!$.fn.dataTable.Buttons._applyExcelStyles) {
                require('datatables-buttons-excel-styles/js/buttons.html5.styles.js')(
                    root,
                    $
                );
            }

            return factory($, root, root.document);
        };
    } else {
        // Browser
        factory(jQuery, window, document);
    }
})(function ($, window, document, undefined) {
    //(function ($) {
    ('use strict');

    var DataTable = $.fn.dataTable;

    /**
     * Override the html5.styles.js applyStyles function to inject the templates into the excelStyles object
     */
    DataTable.ext.buttons.excelHtml5.applyStyles = function (xlsx) {
        var excelStyles = this.excelStyles || this.exportOptions.excelStyles;
        if (excelStyles !== undefined) {
            excelStyles = _makeArray(excelStyles);
            this.excelStyles = _replaceTemplatesWithStyles(excelStyles);
            this._applyExcelStyles(xlsx);
        }
    };

    DataTable.ext.buttons.excelHtml5.getExcelTemplates = function () {
        if (_templatesGenerated === false) {
            _generate_table_templates();
        }
        return _templates;
    };

    DataTable.ext.buttons.excelHtml5.listExcelTemplates = function () {
        var templates = this.getExcelTemplates();
        var list = [];
        for (var i in templates) {
            if (templates[i].desc !== undefined) {
                list.push(i + ',' + templates[i].desc);
            }
        }
        console.log(list.join('\n'));
    };

    /**
     * Standard templates.
     *
     * Note: excelStyles key shortened to es for brevity
     *
     * Extra templates for various color themes generated by the _gen_... functions
     */
    var _templates = {
        b: {
            desc: 'Bold',
            es: {
                cells: 's1:-0',
                style: {
                    font: {
                        b: true,
                    },
                },
            },
        },
        u: {
            desc: 'Underline',
            es: {
                cells: 's1:-0',
                style: {
                    font: {
                        u: true,
                    },
                },
            },
        },
        i: {
            desc: 'Italics',
            es: {
                cells: 's1:-0',
                style: {
                    font: {
                        i: true,
                    },
                },
            },
        },
        title_medium: {
            desc: 'Title: medium size',
            es: {
                cells: ['st'],
                style: {
                    font: {
                        sz: 16,
                    },
                    alignment: {
                        vertical: 'center',
                    },
                },
                height: 28,
            },
        },
        currency_us: {
            desc: 'Currency: USD',
            es: {
                style: {
                    numFmt: '[$$-en-US] #,##0.00',
                },
            },
        },
        currency_eu: {
            desc: 'Currency: Euro',
            es: {
                style: {
                    numFmt: '[$€-x-euro2] #,##0.00',
                },
            },
        },
        currency_gb: {
            desc: 'Currency: GBP',
            es: {
                style: {
                    numFmt: '[$£-en-GB]#,##0.00',
                },
            },
        },
        int: {
            desc: 'Number: Integer',
            es: {
                style: {
                    numFmt: '#,##0;(#,##0)',
                },
            },
        },
        decimal_1: {
            desc: 'Number: 1 decimal place',
            es: {
                style: {
                    numFmt: '#,##0.0;(#,##0.0)',
                },
            },
        },
        decimal_2: {
            desc: 'Number: 2 decimal places',
            es: {
                style: {
                    numFmt: '#,##0.00;(#,##0.00)',
                },
            },
        },
        decimal_3: {
            desc: 'Number: 3 decimal places',
            es: {
                style: {
                    numFmt: '#,##0.000;(#,##0.000)',
                },
            },
        },
        decimal_4: {
            desc: 'Number: 4 decimal places',
            es: {
                style: {
                    numFmt: '#,##0.0000;(#,##0.0000)',
                },
            },
        },
        date_long: {
            desc: 'Date: Long format - eg. 24 September 1979',
            es: {
                style: {
                    numFmt: 'd mmmm yyyy',
                },
            },
        },
        date_medium: {
            desc: 'Date: Medium format - eg. 4 Jun 1987',
            es: {
                style: {
                    numFmt: 'd mmm yyyy',
                },
            },
        },
    };

    /**
     * Turn a value into an array if it isn't already one
     *
     * @param {any|array} value
     */
    var _makeArray = function (value) {
        if (!Array.isArray(value)) {
            return [value];
        }
        return value;
    };

    var _templatesGenerated = false;

    /**
     * Replace any template names found in the styles with the template style content
     *
     * @param {array} excelStyles The excel styles to apply
     */
    var _replaceTemplatesWithStyles = function (excelStyles) {
        var styleArray = [];
        for (var i in excelStyles) {
            if (excelStyles[i].template !== undefined) {
                if (_templatesGenerated === false) {
                    _generate_table_templates();
                }
                var templateList = _makeArray(excelStyles[i].template);
                for (var j in templateList) {
                    var templateName = templateList[j];
                    var template = _getTemplate(templateName);
                    if (template !== false) {
                        var cells = excelStyles[i].cells || undefined;
                        _addStyles(cells, template.es, styleArray);
                    } else {
                        console.log(
                            "Error: Template '" +
                                templateName +
                                "' not found. Ignoring template."
                        );
                    }
                }
            } else {
                styleArray.push(excelStyles[i]);
            }
        }
        return styleArray;
    };

    var _addStyles = function (cells, excelStyles, styleArray) {
        if (Array.isArray(excelStyles)) {
            for (var j in excelStyles) {
                if (Array.isArray(excelStyles[j])) {
                    _addStyles(cells, excelStyles[j], styleArray);
                } else {
                    if (cells !== undefined) {
                        excelStyles[j].cells = cells;
                    }
                    styleArray.push(excelStyles[j]);
                }
            }
        } else {
            if (cells !== undefined) {
                excelStyles.cells = cells;
            }
            styleArray.push(excelStyles);
        }
    };

    var _getTemplate = function (templateName) {
        return _templates[templateName] || false;
    };

    var _tc = {
        black: '000000',
        white: 'FFFFFF',
        blue: '4472C4',
        blue_gray: '44546A',
        orange: 'ED7D31',
        gray: 'A5A5A5',
        light_gray: 'E7E6E6',
        gold: 'FFC000',
        cyan: '5B9BD5',
        green: '70AD47',
    };

    var _header_font_exceptions = {
        E7E6E6: '000000', // Black font for light gray header
    };

    var _gen_header = function (themeColor) {
        var font_color = _tc.white;
        if (_header_font_exceptions[themeColor] !== undefined) {
            font_color = _header_font_exceptions[themeColor];
        }
        return {
            cells: ['sh', 'sf'],
            style: {
                font: {
                    color: font_color,
                },
                fill: {
                    pattern: {
                        color: themeColor,
                    },
                },
            },
        };
    };

    var _gen_collines = function (themeColor) {
        return [
            {
                cells: ['sh', 'sf', 'sA:>'],
                style: {
                    border: {
                        left: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                        right: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                    },
                },
            },
        ]
    };

    var _gen_outline = function (themeColor) {
        return [
            {
                cells: ['sh', 'sf'],
                style: {
                    border: {
                        top: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                        bottom: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                    },
                },
            },
            {
                cells: ['sA', 'sAh', 'sAf'],
                style: {
                    border: {
                        left: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                    },
                },
            },
            {
                cells: ['s>', 's>h', 's>f'],
                style: {
                    border: {
                        right: {
                            style: 'thin',
                            color: {
                                rgb: themeColor,
                                tint: 0.4,
                            },
                        },
                    },
                },
            },
        ];
    };

    var _gen_rowlines = function (themeColor) {
        return {
            cells: 's1:-0',
            style: {
                border: {
                    top: {
                        style: 'thin',
                        color: {
                            rgb: themeColor,
                            tint: 0.4,
                        },
                    },
                    bottom: {
                        style: 'thin',
                        color: {
                            rgb: themeColor,
                            tint: 0.4,
                        },
                    },
                },
            },
        };
    };

    var _gen_stripes = function (themeColor) {
        return {
            cells: 's1:n,2',
            style: {
                fill: {
                    pattern: {
                        color: {
                            rgb: themeColor,
                            tint: 0.8,
                        },
                    },
                },
            },
        };
    };

    var _capitalize = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /**
     * Generate table style templates for each template color (_tc)
     */
    var _generate_table_templates = function () {
        _templatesGenerated = true;
        var gens = {
            header: _gen_header,
            rowlines: _gen_rowlines,
            collines: _gen_collines,
            outline: _gen_outline,
            stripes: _gen_stripes,
        };
        for (var color in _tc) {
            if (color == 'white') {
                continue;
            }
            var _fullTable = [];
            for (var gen_key in gens) {
                _templates[gen_key + '_' + color] = {
                    desc: _capitalize(gen_key) + ': ' + color,
                    es: gens[gen_key](_tc[color]),
                };
                _fullTable.push(_templates[gen_key + '_' + color].es);
            }
            _templates[color + '_medium'] = {
                desc: 'Complete table: ' + color,
                es: _fullTable,
            };
        }
    };

    return DataTable.Buttons;
});
