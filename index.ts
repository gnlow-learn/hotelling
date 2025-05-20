import { html, render } from "https://esm.sh/lit-html@3.3.0"
import "https://esm.sh/adorable-css@1.6.2"

import { World } from "./src/World.ts"

render(html`
<div class="w(100%) h(100%) p(20)">
    <canvas
        width="100"
        height="100"
        class="h(100%) b(#555/2)"
    ></canvas>
</div>
`, document.body)

const $canvas = document.querySelector("canvas")!

const tick = () => new Promise(requestAnimationFrame)

const ctx = $canvas.getContext("2d")!

const world = new World(100, 100)
while (true) {
    await tick()
    world.step()
    world.render(ctx)
}
