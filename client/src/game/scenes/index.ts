// src/utils/index.ts

import test_scene2 from './game/TestPlace';
import { BootScene } from './system/BootScene';
import { MainMenuScene } from './ui/MainMenu';
import { TMainMenuScene } from './ui/MainMenu2';

export const scenes = [BootScene, MainMenuScene, test_scene2];
export const BootSceneKey = BootScene.sceneKey;
