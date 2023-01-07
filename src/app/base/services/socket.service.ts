import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})

export class SocketService {

	private sock: any = null;
	private messageListener: any = null;

	constructor() {
		const address: string = environment.webSocket;
		this.sock = new WebSocket(address);

		this.sock.addEventListener('open', (error: any) => {
			this.onResponse('open', error);
		});

		this.sock.addEventListener('message', (error: any) => {
			this.onResponse('message', error);
		});

		this.sock.addEventListener('close', (error: any) => {
			this.onResponse('close', error);
		});

		this.sock.addEventListener('error', (error: any) => {
			this.onResponse('error', error);
		});
	}

	public addMessageListener(listener: (name: any, event: any) => void): void {
		this.messageListener = listener;
	}

	public onResponse(name: any, event: any): void {
		if (this.messageListener) {
			this.messageListener(name, event);
		}
	}

	public request(data: any): void {
		this.sock.send(data);
	}

}
