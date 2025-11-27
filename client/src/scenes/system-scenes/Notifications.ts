import { WithPhaserLifecycle } from '@abstracts/scene-base/WithPhaserLifecycle';
import { SceneInfo } from '@decorators/sceneInfo.decorator';
import { SceneKeys, SceneTypes } from '@gametypes/scene.types';

@SceneInfo(SceneKeys.Notifications, [SceneTypes.SystemScene, SceneTypes.HTMLScene])
export class NotificationScene extends WithPhaserLifecycle {
	private container: HTMLDivElement;
	private static instance: NotificationScene;

	public preload(): void {
		super.preload();
		NotificationScene.instance = this;
		this.createContainer();
	}

	public shutdown(): void {
		if (this.container) {
			this.container.remove();
		}
	}

	private createContainer() {
		const existing = document.getElementById('notification-container');
		if (existing) existing.remove();

		this.container = document.createElement('div');
		this.container.id = 'notification-container';
		this.container.classList.add('notification-container');
		document.body.append(this.container);
	}

	public show(message: string, type: 'success' | 'error' | 'info', title?: string) {
		if (!this.container) return;

		const toast = document.createElement('div');
		toast.className = `notification-toast ${type}`;

		const defaultTitle = type === 'error' ? 'Ошибка' : type === 'success' ? 'Успешно' : 'Инфо';

		toast.innerHTML = `
            <div class="content">
                <div class="title">${title || defaultTitle}</div>
                <div class="message">${message}</div>
            </div>
        `;

		this.container.appendChild(toast);

		const timer = setTimeout(() => this.removeToast(toast), (__PRODUCTION__ && 4000) || 7000);

		toast.addEventListener('click', () => {
			if (toast.classList.contains('hiding')) return;
			clearTimeout(timer);
			this.removeToast(toast);
		});
	}

	public clearAll() {
		if (this.container) {
			this.container.innerHTML = '';
		}
	}

	private removeToast(toast: HTMLElement) {
		if (toast.classList.contains('hiding')) return;
		toast.classList.add('hiding');
		toast.addEventListener('animationend', () => toast.remove());
	}

	public static showToast(message: string, type: 'success' | 'error' | 'info', title?: string) {
		if (this.instance && this.instance.sys.isActive()) {
			this.instance.show(message, type, title);
		} else {
			console.warn('NotificationScene is not active!');
		}
	}

	public static clearNotifications() {
		if (this.instance) {
			this.instance.clearAll();
		}
	}
}
