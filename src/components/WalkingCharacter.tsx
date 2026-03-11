import { useEffect, useRef } from 'react';
import { Application, Assets, Texture, Rectangle, AnimatedSprite } from 'pixi.js';
import spriteUrl from '@/assets/character-sprite.png';

// ── Sprite sheet config ──────────────────────────────────────────────────────
const SHEET_COLS = 4;
const SHEET_ROWS = 8;
const TOTAL_FRAMES = 27;
const FRAME_SPEED = 16;
const MOVE_SPEED = 0.7;
const AUTO_MOVE_SPEED = 0.45;
const AUTO_RESUME_DELAY_MS = 1800;
const TARGET_REACH_RADIUS = 14;
const DEFAULT_DOOR_HIDE_MS = 1200;

const CHAR_W = 110;
const CHAR_H = 100;

// ── Walkable polygon (frações do mapa) ───────────────────────────────────────
const WALKABLE: [number, number][] = [
    [0.50, 0.05],
    [0.65, 0.12],
    [0.88, 0.38],
    [0.88, 0.55],
    [0.65, 0.80],
    [0.55, 0.90],
    [0.50, 0.93],
    [0.45, 0.90],
    [0.35, 0.80],
    [0.12, 0.55],
    [0.12, 0.38],
    [0.35, 0.12],
];

const AUTO_WAYPOINTS: [number, number][] = [
    [0.50, 0.22],
    [0.72, 0.36],
    [0.74, 0.58],
    [0.56, 0.76],
    [0.44, 0.76],
    [0.26, 0.58],
    [0.28, 0.36],
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function pointInPolygon(px: number, py: number, poly: [number, number][]): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface CharacterClickCommand {
    requestId: number;
    x: number;
    y: number;
}

export interface DoorZone {
    id: string;
    x: number;
    y: number;
    radius: number;
    hideMs?: number;
}

export interface WalkingCharacterConfig {
    id?: string;
    autoWalk?: boolean;
    clickToMove?: boolean;
    waypoints?: [number, number][];
    doors?: DoorZone[];
    autoMoveSpeed?: number;
    manualMoveSpeed?: number;
    autoResumeDelayMs?: number;
    targetReachRadius?: number;
    defaultDoorHideMs?: number;
    // Sprite overrides
    spriteUrl?: string;
    sheetCols?: number;
    sheetRows?: number;
    totalFrames?: number;
    frameSpeed?: number;
    charW?: number;
    charH?: number;
    // Actions
    onClick?: (id: string) => void;
}

interface Props {
    containerRef: React.RefObject<HTMLDivElement>;
    clickCommand?: CharacterClickCommand | null;
    config?: WalkingCharacterConfig;
}

// ── Component ────────────────────────────────────────────────────────────────
export function WalkingCharacter({ containerRef, clickCommand, config }: Props) {
    const pixiRef = useRef<HTMLDivElement>(null);
    const clickCommandRef = useRef<CharacterClickCommand | null>(clickCommand ?? null);

    useEffect(() => {
        clickCommandRef.current = clickCommand ?? null;
    }, [clickCommand]);

    useEffect(() => {
        const wrapper = pixiRef.current;
        if (!wrapper) return;

        let destroyed = false;
        let pixiApp: Application | null = null;
        let keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
        let keyUpHandler: ((e: KeyboardEvent) => void) | null = null;

        (async () => {
            // ── Create PixiJS Application ────────────────────────────────────
            const app = new Application();
            await app.init({
                backgroundAlpha: 0,
                antialias: true,
                width: wrapper.clientWidth || 800,
                height: wrapper.clientHeight || 600,
                eventMode: 'passive'
            });

            if (destroyed) { app.destroy(); return; }
            pixiApp = app;

            // Style the PixiJS-created canvas to fill the wrapper
            const canvas = app.canvas as HTMLCanvasElement;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            wrapper.appendChild(canvas);

            // ── Load sprite sheet → create frame textures ────────────────────
            const activeSpriteUrl = config?.spriteUrl ?? spriteUrl;
            const sheetTexture = await Assets.load(activeSpriteUrl);
            if (destroyed) return;

            const cols = config?.sheetCols ?? SHEET_COLS;
            const rows = config?.sheetRows ?? SHEET_ROWS;
            const totalFrames = config?.totalFrames ?? TOTAL_FRAMES;
            const cw = config?.charW ?? CHAR_W;
            const ch = config?.charH ?? CHAR_H;
            const fSpeed = config?.frameSpeed ?? FRAME_SPEED;

            const fw = sheetTexture.width / cols;
            const fh = sheetTexture.height / rows;
            const frames: Texture[] = [];
            for (let i = 0; i < totalFrames; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                frames.push(
                    new Texture({
                        source: sheetTexture.source,
                        frame: new Rectangle(col * fw, row * fh, fw, fh),
                    }),
                );
            }

            // ── Create AnimatedSprite ────────────────────────────────────────
            const character = new AnimatedSprite(frames);
            character.anchor.set(0.5, 0.80);
            character.animationSpeed = 0; // manual frame control
            character.gotoAndStop(0);

            // Interaction
            if (config?.onClick) {
                character.eventMode = 'static';
                character.cursor = 'pointer';
                character.on('pointerdown', (e) => {
                    e.stopPropagation();
                    config.onClick!(config.id ?? 'unknown');
                });
            }

            app.stage.addChild(character);

            const baseScaleX = cw / fw;
            const baseScaleY = ch / fh;

            const waypoints = config?.waypoints && config.waypoints.length > 0
                ? config.waypoints
                : AUTO_WAYPOINTS;
            const doors = config?.doors ?? [];
            const autoWalkEnabled = config?.autoWalk ?? true;
            const clickToMoveEnabled = config?.clickToMove ?? true;
            const autoSpeed = config?.autoMoveSpeed ?? AUTO_MOVE_SPEED;
            const manualSpeed = config?.manualMoveSpeed ?? MOVE_SPEED;
            const autoResumeDelayMs = config?.autoResumeDelayMs ?? AUTO_RESUME_DELAY_MS;
            const targetReachRadius = config?.targetReachRadius ?? TARGET_REACH_RADIUS;
            const defaultDoorHideMs = config?.defaultDoorHideMs ?? DEFAULT_DOOR_HIDE_MS;

            // ── Game state ───────────────────────────────────────────────────
            const initialPos = waypoints.length > 0 ? waypoints[0] : [0.50, 0.55];
            let rx = initialPos[0];
            let ry = initialPos[1];
            let frameIdx = 0;
            let frameTick = 0;
            let flipH = false;
            const keys: Record<string, boolean> = {};
            let autoPausedUntil = 0;

            let targetIdx = waypoints.length > 1 ? 1 : 0;
            let clickTarget: [number, number] | null = null;
            let clickTargetDoorId: string | null = null;
            let lastClickRequestId = -1;
            let hiddenUntil = 0;

            // ── Helpers ──────────────────────────────────────────────────────
            function rendererSize(): [number, number] {
                return [app.renderer.width, app.renderer.height];
            }

            function getScaledPoly(): [number, number][] {
                const [W, H] = rendererSize();
                return WALKABLE.map(([fx, fy]) => [fx * W, fy * H]);
            }

            function tryMove(moveDx: number, moveDy: number): boolean {
                const [W, H] = rendererSize();
                const poly = getScaledPoly();
                const nx = rx * W + moveDx;
                const ny = ry * H + moveDy;
                if (pointInPolygon(nx, ny, poly)) {
                    rx = nx / W;
                    ry = ny / H;
                    return true;
                } else if (pointInPolygon(nx, ry * H, poly)) {
                    rx = nx / W;
                    return true;
                } else if (pointInPolygon(rx * W, ny, poly)) {
                    ry = ny / H;
                    return true;
                }
                return false;
            }

            function nextTarget() {
                if (waypoints.length === 0) return;
                targetIdx = (targetIdx + 1) % waypoints.length;
            }

            function getDoorForTarget(tgtX: number, tgtY: number): DoorZone | null {
                const [W, H] = rendererSize();
                for (const door of doors) {
                    if (Math.hypot(tgtX * W - door.x * W, tgtY * H - door.y * H) <= door.radius) {
                        return door;
                    }
                }
                return null;
            }

            // ── Keyboard listeners ───────────────────────────────────────────
            keyDownHandler = (e: KeyboardEvent) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                }
                keys[e.key] = true;
            };
            keyUpHandler = (e: KeyboardEvent) => { keys[e.key] = false; };
            window.addEventListener('keydown', keyDownHandler);
            window.addEventListener('keyup', keyUpHandler);

            // ── Game loop via PixiJS Ticker ───────────────────────────────────
            app.ticker.add(() => {
                // Sync renderer size with map container
                const el = containerRef.current;
                if (el) {
                    const r = el.getBoundingClientRect();
                    const rw = Math.round(r.width);
                    const rh = Math.round(r.height);
                    if (app.renderer.width !== rw || app.renderer.height !== rh) {
                        app.renderer.resize(rw, rh);
                    }
                }

                const [W, H] = rendererSize();

                // ── Input ────────────────────────────────────────────────────
                let dx = 0;
                let dy = 0;
                let manualDx = 0;
                let manualDy = 0;
                if (keys['ArrowLeft'] || keys['a'] || keys['A']) manualDx -= 1;
                if (keys['ArrowRight'] || keys['d'] || keys['D']) manualDx += 1;
                if (keys['ArrowUp'] || keys['w'] || keys['W']) manualDy -= 1;
                if (keys['ArrowDown'] || keys['s'] || keys['S']) manualDy += 1;

                // Click-to-move
                const latestClick = clickCommandRef.current;
                if (clickToMoveEnabled && latestClick && latestClick.requestId !== lastClickRequestId) {
                    lastClickRequestId = latestClick.requestId;
                    const clkX = Math.max(0, Math.min(1, latestClick.x));
                    const clkY = Math.max(0, Math.min(1, latestClick.y));
                    if (pointInPolygon(clkX * W, clkY * H, getScaledPoly())) {
                        clickTarget = [clkX, clkY];
                        clickTargetDoorId = getDoorForTarget(clkX, clkY)?.id ?? null;
                        autoPausedUntil = performance.now() + autoResumeDelayMs;
                    }
                }

                const now = performance.now();
                const hidden = now < hiddenUntil;
                const manualMoving = manualDx !== 0 || manualDy !== 0;
                const moveSpeed = manualMoving ? manualSpeed : autoSpeed;

                if (!hidden && manualMoving) {
                    dx = manualDx;
                    dy = manualDy;
                    autoPausedUntil = now + autoResumeDelayMs;
                } else if (!hidden && clickToMoveEnabled && clickTarget) {
                    const tx = clickTarget[0] * W;
                    const ty = clickTarget[1] * H;
                    const cx = rx * W;
                    const cy = ry * H;
                    const vx = tx - cx;
                    const vy = ty - cy;
                    const dist = Math.hypot(vx, vy);

                    if (dist <= targetReachRadius) {
                        if (clickTargetDoorId) {
                            const selectedDoor = doors.find((d) => d.id === clickTargetDoorId);
                            hiddenUntil = now + (selectedDoor?.hideMs ?? defaultDoorHideMs);
                        }
                        clickTarget = null;
                        clickTargetDoorId = null;
                    } else if (dist > 0) {
                        dx = vx / dist;
                        dy = vy / dist;
                    }
                } else if (!hidden && autoWalkEnabled && now >= autoPausedUntil && waypoints.length > 0) {
                    const [targetFx, targetFy] = waypoints[targetIdx];
                    const tx = targetFx * W;
                    const ty = targetFy * H;
                    const cx = rx * W;
                    const cy = ry * H;
                    const vx = tx - cx;
                    const vy = ty - cy;
                    const dist = Math.hypot(vx, vy);

                    if (dist <= moveSpeed * 1.5) {
                        // Snap exactly to target to prevent corner cutting that throws it off the line
                        rx = targetFx;
                        ry = targetFy;
                        nextTarget();
                    } else if (dist > 0) {
                        dx = vx / dist;
                        dy = vy / dist;
                    }
                }

                // Normalize diagonal for manual movement
                if (manualMoving && dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
                dx *= moveSpeed;
                dy *= moveSpeed;

                const moving = dx !== 0 || dy !== 0;

                if (moving) {
                    flipH = dy < 0 || dx > 0;

                    if (manualMoving || (clickToMoveEnabled && clickTarget)) {
                        const moved = tryMove(dx, dy);
                        if (!manualMoving && !moved) {
                            clickTarget = null;
                        }
                    } else if (autoWalkEnabled) {
                        // By bypassing tryMove for auto-walking, the character strictly follows the drawn path
                        rx += dx / W;
                        ry += dy / H;
                    }
                    frameTick++;
                    if (frameTick >= fSpeed) {
                        frameTick = 0;
                        frameIdx = (frameIdx + 1) % totalFrames;
                    }
                } else {
                    frameIdx = 0;
                    frameTick = 0;
                }

                // ── Update PixiJS sprite ─────────────────────────────────────
                character.visible = !hidden;
                character.x = rx * W;
                character.y = ry * H;
                character.scale.x = flipH ? -baseScaleX : baseScaleX;
                character.scale.y = baseScaleY;
                character.gotoAndStop(frameIdx);
            });
        })();

        return () => {
            destroyed = true;
            if (keyDownHandler) window.removeEventListener('keydown', keyDownHandler);
            if (keyUpHandler) window.removeEventListener('keyup', keyUpHandler);
            if (pixiApp) {
                pixiApp.stop();
                pixiApp.destroy(true);
            }
            // Clear any leftover canvas from wrapper
            if (wrapper) {
                while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
            }
        };
    }, [containerRef, config]);

    return (
        <div
            ref={pixiRef}
            className="absolute inset-0 z-20 pointer-events-none"
        />
    );
}
