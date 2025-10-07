import { type GameData } from "../network/NetworkManager";
import { BasicGameScene } from "./BasicGameScene";

/**
 * NetworkedScene - абстрактный класс.
 * Его главная задача - служить шаблонов для всех сцен,
 * которые могут взаимодейстовать с игроками (т.е игровые сцены)
 */

export abstract class NetworkedScene extends BasicGameScene
{
    protected connectedPlayers: Set<string> = new Set();

    abstract onPlayerConnected(peerId: string): void;
    abstract onPlayerDisconnected(peerId: string): void;
    abstract handleNetworkData(peerId: string, data: GameData): void;

    protected logNetworkEvent(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${this.scene.key} @ ${timestamp}] ${message}`);
    }
}
