/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {retry} from "rxjs/operators";

import {QueryableService} from "./queryable.service";
import {Errors} from "../library/errors";

/**
 * 更新サービス
 *
 * @since 0.01
 */
export abstract class UpdatableService extends QueryableService {

	/**
	 * @constructor
	 * @param http
	 * @param model
	 */
	protected constructor(
		protected http: HttpClient,
		protected model: string,
	) {
		super(http, model);
	}

	/**
	 * レコードクリエイト
	 *
	 * @param content クリエイトデータ
	 * @param callback コールバック
	 */
	public post(content: any, callback: Callback<any>): void {
		this.http.post(this.endPoint + "/" + this.model + "/auth", content, this.httpOptions).pipe(retry(3)).subscribe(
			{
				next: (result: any): void => {
					if (this.isNumber(result.code)) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00196"), null);
						}
					} else {
						callback(Errors.httpError(500, "A00197"), null);
					}
				},
				error: (error: HttpErrorResponse): void => {
					callback(Errors.socketError(error, "A00198"), null);
				},
				complete: () => {
				}
			}
		);
	}

	/**
	 * レコード更新
	 *
	 * @param id レコードID
	 * @param content 更新内容
	 * @param callback コールバック
	 */
	public put(id: string, content: any, callback: Callback<any>): void {
		this.http.put(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe(
			{
				next: (result: any): void => {
					if (this.isNumber(result.code)) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00199"), null);
						}
					} else {
						callback(Errors.httpError(500, "A00200"), null);
					}
				},
				error: (error: HttpErrorResponse): void => {
					callback(Errors.socketError(error, "A00201"), null);
				},
				complete: () => {
				}
			}
		);
	}

	// public set(id: string, command: string, content: IContent, callback: Callback<any>): void {
	// 	this.http.put(this.endPoint + "/" + this.model + "/auth/set/" + command + "/" + encodeURIComponent(id), content, this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
	// 		if (result) {
	// 			if (result.code === 0) {
	// 				callback(null, result.value);
	// 			} else {
	// 				callback(result, null);
	// 			}
	// 		} else {
	// 			callback(this.networkError("0000"), null);
	// 		}
	// 	}, (error: HttpErrorResponse): void => {
	// 		callback(this.networkException(error,"0001"), null);
	// 	});
	// }

	/**
	 * レコード削除
	 *
	 * @param id 削除レコードID
	 * @param callback コールバック
	 */
	public delete(id: string, callback: Callback<any>): void {
		this.http.delete(this.endPoint + "/" + this.model + "/auth/" + encodeURIComponent(id), this.httpOptions).pipe(retry(3)).subscribe(
			{
				next: (result: any): void => {
					if (this.isNumber(result.code)) {
						if (result.code === 0) {
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00202"), null);
						}
					} else {
						callback(Errors.httpError(500, "A00203"), null);
					}
				},
				error: (error: HttpErrorResponse): void => {
					callback(Errors.socketError(error, "A00204"), null);
				},
				complete: () => {
				}
			}
		);
	}

}
