import StartGame from '../src/game/main';

// Integración en navegador real, sin dependencias adicionales.
// Consola del servidor de desarrollo:
// (await import('/tests/browser-playtest.js')).runPlaytest()
// Se usan posiciones controladas para aislar colisiones; no reemplaza jugar el recorrido.
export async function runPlaytest() {
    const host = document.createElement('div');
    host.id = 'playtest-container';
    Object.assign(host.style, { position: 'fixed', inset: '0', zIndex: '100', background: '#173c46' });
    document.body.append(host);
    const game = StartGame(host.id);
    const results = [];
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const check = (condition, message) => {
        if (!condition) throw new Error(message);
        results.push(message);
    };
    const key = (type, code, keyCode) => document.body.dispatchEvent(new KeyboardEvent(type, {
        code, keyCode, key: code === 'Space' ? ' ' : code, bubbles: true
    }));
    const tapJump = async () => {
        key('keydown', 'Space', 32);
        await wait(40);
        key('keyup', 'Space', 32);
    };
    const waitFor = async predicate => {
        for (let attempt = 0; attempt < 100; attempt++) {
            if (predicate()) return;
            await wait(50);
        }
        throw new Error('Tiempo de espera agotado');
    };
    const findPlayer = scene => scene.children.list.find(child => child.texture?.key === 'characters' && !child.getData('entity'));
    const disableEnemies = scene => {
        for (const child of scene.children.list) {
            if (child.getData('entity')?.touch && child.body) child.body.enable = false;
        }
    };
    try {
        await waitFor(() => game.scene.isActive('Menu'));
        game.scene.getScene('Menu').input.keyboard.emit('keydown-ENTER');
        await waitFor(() => game.scene.isActive('World'));
        check(game.scene.isActive('World'), 'Menú → pantalla del mundo');
        await waitFor(() => game.scene.isActive('Game'));
        let scene = game.scene.getScene('Game');
        let player = findPlayer(scene);
        disableEnemies(scene);
        await wait(100);
        check(game.registry.get('session').snapshot.lives === 3 && player.body.width === 16 && player.body.height === 22,
            'Inicio con 3 vidas y hitbox Small Mario 16 × 22');
        const initialX = player.x;
        key('keydown', 'ArrowRight', 39);
        await wait(250);
        key('keyup', 'ArrowRight', 39);
        await wait(40);
        check(player.x > initialX + 15, 'Movimiento horizontal con teclado');
        const groundY = player.y;
        await tapJump();
        await wait(150);
        check(player.y < groundY - 20, 'Salto con teclado');
        await wait(800);
        check(Math.abs(player.y - 330) < 1, 'Gravedad y aterrizaje sobre suelo');
        const coin = scene.children.list.find(child => child.texture?.key === 'tiles' && child.frame.name === 151);
        player.body.reset(coin.x, coin.y + 8);
        await wait(80);
        check(game.registry.get('session').snapshot.coins === 1 && game.registry.get('session').snapshot.score === 100,
            'Moneda: +1 coin y +100 score');

        const smallBrick = scene.children.list.find(child => child.texture?.key === 'tiles' && child.frame.name === 29);
        player.body.reset(smallBrick.x, 330);
        await wait(100);
        await tapJump();
        await wait(450);
        check(smallBrick.active, 'Small Mario no rompe ladrillos');
        const hard = scene.children.list.find(child => child.texture?.key === 'tiles' && child.frame.name === 11);
        const hardY = hard.y;
        player.body.reset(hard.x, 330);
        await wait(100);
        await tapJump();
        await wait(450);
        check(hard.active && hard.y === hardY, 'Hard Block vuelve a su posición y no se rompe');

        const question = scene.children.list.find(child => child.texture?.key === 'tiles' && child.frame.name === 10);
        player.body.reset(question.x, 330);
        await wait(100);
        await tapJump();
        await wait(750);
        check(question.frame.name === 9, 'Golpe inferior: Question Block → Empty Block');
        const mushroom = scene.children.list.find(child => child.texture?.key === 'tiles' && child.frame.name === 128);
        check(!!mushroom && mushroom.body.enable, 'Super Mushroom emerge y activa su física');
        player.body.reset(mushroom.x, mushroom.y + 9);
        await wait(80);
        check(player.scaleX === 1.5 && player.body.width === 20 && player.body.height === 26,
            'Recoger hongo transforma a Super Mario: 20 × 26');
        player.body.reset(question.x, 330);
        await wait(100);
        await tapJump();
        await wait(350);
        check(question.frame.name === 9 && !scene.children.list.some(child => child.texture?.key === 'tiles' && child.frame.name === 128),
            'Empty Block no vuelve a entregar objetos');
        player.body.reset(54, 330);
        await wait(100);
        const brick = scene.children.list.find(child => child.body && child.texture?.key === 'tiles' && child.frame.name === 29);
        player.body.reset(brick.x, 330);
        await wait(80);
        await tapJump();
        await wait(350);
        check(!brick.active, 'Super Mario rompe ladrillos desde abajo');

        player.body.reset(54, 330);
        const goomba = scene.children.list.find(child => child.texture?.key === 'characters' && child.getData('entity'));
        goomba.body.enable = true;
        goomba.body.reset(65, 330);
        await wait(80);
        check(player.scaleX === 1 && game.registry.get('session').snapshot.lives === 3,
            'Daño lateral: Super → Small sin perder vidas');
        await wait(300);
        check(game.registry.get('session').snapshot.lives === 3, 'Invulnerabilidad evita daño repetido');
        goomba.body.enable = false;
        player.body.reset(200, 300);
        player.setVelocityY(140);
        goomba.body.enable = true;
        goomba.body.reset(200, 330);
        await wait(140);
        check(!goomba.body?.enable && player.body.velocity.y < 0, 'Pisotón aplasta al Goomba y produce rebote');

        player.body.reset(700, 425);
        await wait(100);
        check(game.registry.get('session').snapshot.lives === 2, 'Caer al pozo descuenta una vida');
        await waitFor(() => game.scene.isActive('World'));
        await waitFor(() => game.scene.isActive('Game'));
        scene = game.scene.getScene('Game');
        player = findPlayer(scene);
        disableEnemies(scene);
        check(player.scaleX === 1 && player.x === 54 && game.registry.get('session').snapshot.score === 100,
            'Reinicio Small al comienzo conservando el puntaje');

        for (let remaining = 1; remaining >= 0; remaining--) {
            player.body.reset(700, 425);
            await wait(100);
            check(game.registry.get('session').snapshot.lives === remaining, `Descuento de vida: ${remaining}`);
            if (remaining) {
                await waitFor(() => game.scene.isActive('World'));
                await waitFor(() => game.scene.isActive('Game'));
                scene = game.scene.getScene('Game');
                player = findPlayer(scene);
                disableEnemies(scene);
            }
        }
        await waitFor(() => game.scene.isActive('End'));
        check(scene.scene.isActive('End'), 'Sin vidas → Game Over');
        game.scene.getScene('End').input.keyboard.emit('keydown-ENTER');
        await waitFor(() => game.scene.isActive('Menu'));
        game.scene.getScene('Menu').input.keyboard.emit('keydown-ENTER');
        check(game.registry.get('session').snapshot.score === 0 && game.registry.get('session').snapshot.lives === 3,
            'Nueva partida reinicia los contadores');
        await waitFor(() => game.scene.isActive('Game'));
        scene = game.scene.getScene('Game');
        player = findPlayer(scene);
        disableEnemies(scene);
        const plant = scene.children.list.find(child => child.texture?.key.startsWith('piranha_'));
        const hiddenY = plant.y;
        const pipeTop = hiddenY - 34;
        plant.body.enable = true;
        player.body.reset(plant.x, pipeTop);
        await wait(100);
        check(game.registry.get('session').snapshot.lives === 3, 'Planta oculta no daña al estar sobre la tubería');
        player.body.reset(54, 330);
        scene.spawnMushroom(54, 321);
        await wait(650);
        check(player.scaleX === 1.5, 'Hongo disponible también en la nueva partida');
        await waitFor(() => plant.y <= hiddenY - 25.9);
        player.body.reset(plant.x, pipeTop - 28);
        player.setVelocityY(160);
        await wait(160);
        check(player.scaleX === 1 && plant.active && game.registry.get('session').snapshot.lives === 3,
            'Planta expuesta causa daño desde arriba y no se puede aplastar');
        player.body.reset(3330, 330);
        await wait(100);
        check(!player.body.enable, 'Meta bloquea el movimiento del jugador');
        await waitFor(() => game.scene.isActive('End'));
        check(game.scene.getScene('End').children.list.some(child => child.text === '¡Nivel completado!'),
            'Meta → pantalla de nivel completado');
        return { passed: true, checks: results };
    } catch (error) {
        const scene = game.scene.getScene('Game');
        const player = scene && findPlayer(scene);
        return {
            passed: false, checks: results, error: error.message,
            player: player && { x: player.x, y: player.y, scale: player.scaleX, velocityY: player.body.velocity.y },
            blocks: scene?.children.list.filter(child => child.body && child.getData('entity')?.hit)
                .map(child => ({ x: child.x, y: child.y, frame: child.frame.name }))
        };
    } finally {
        key('keyup', 'ArrowRight', 39);
        key('keyup', 'Space', 32);
        game.destroy(true);
        host.remove();
    }
}
