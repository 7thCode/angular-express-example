/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

/**
 * isNumber
 *
 * @remarks
 * is Number?
 *
 * @param value - unknown value.
 * @returns True/False
 */
export function isNumber(value: unknown): boolean {
    return ((typeof value === 'number') && (isFinite(value)));
}

/**
 * isObject
 *
 * @remarks
 * is Object or Array.
 * [] or {} is True.
 *
 * @param value - unknown value.
 * @returns True/False
 */
export function isContainer(value: unknown): boolean {
    return ((value !== null) && (typeof value === 'object'));
}

