/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Callback, ISession} from "../../../../../types/platform/universe";

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";

import {HttpService} from "./http.service";
import {Errors} from "../library/errors";

/**
 * セッションサービス
 *
 * @since 0.01
 */

@Injectable({
	providedIn: "root",
})
export class SessionService extends HttpService {

	public cache: any;

	/**
	 * @constructor
	 * @param http
	 */
	constructor(
		protected http: HttpClient,
	) {
		super(http);
		this.cache = null;
	}

	/**
	 * セッション取得
	 *
	 * @param callback コールバック
	 */
	public get(callback: Callback<ISession>): void {
		//	if (this.cache) {
		//		callback(null, this.cache);
		//	} else {
		this.http.get(this.endPoint + "/session/auth", this.httpOptions).pipe(retry(3)).subscribe(
			{
				next: (result: any): void => {
					if (this.isNumber(result.code)) {
						if (result.code === 0) {
							this.cache = result.value;
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A03037"), null);
						}
					} else {
						callback(Errors.httpError(500, "A03137"), null);
					}
				},
				error: (error: HttpErrorResponse) => {
					callback(Errors.socketError(error, "A00038"), null);
				},
				complete: () => {
				}
			}
		);
		//	}
	}

	/**
	 * セッション更新
	 *
	 * @param content 更新内容
	 * @param callback コールバック
	 */
	public put(content: object, callback: Callback<ISession>): void {
		this.http.put(this.endPoint + "/session/auth", content, this.httpOptions).pipe(retry(3)).subscribe(
			{
				next: (result: any): void => {
					if (this.isNumber(result.code)) {
						if (result.code === 0) {
							//		if (this.cache) {
							//			if (this.cache.data) {
							//				this.cache.data = result.value;
							//			}
							//		}
							callback(null, result.value);
						} else {
							callback(Errors.serverError(result, "A00039"), null);
						}
					} else {
						callback(Errors.httpError(500, "A00040"), null);
					}
				},
				error: (error: HttpErrorResponse) => {
					callback(Errors.socketError(error, "A00041"), null);
				},
				complete: () => {
				}
			}
		);
	}

}
