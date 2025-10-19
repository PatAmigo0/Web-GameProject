// src/game/types/index.ts

import { TestPlace } from './game/TestPlace';
import { BootScene } from './system/BootScene';
import { MainMenuScene } from './ui/deprecated.Menu';
import { TMainMenuScene } from './ui/MainMenu'; // Debug

export const scenes = [BootScene, MainMenuScene, TMainMenuScene, TestPlace];
