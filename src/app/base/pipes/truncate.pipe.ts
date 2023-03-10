/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: "truncate"
})
export class TruncatePipe implements PipeTransform {

	transform(value: string, limit: number, trail: string = "..."): string {
		let result = value;
		if (value) {
			if (value.length > limit) {
				result = value.substring(0, limit) + trail;
			}
		}
		return result;
	}

}








