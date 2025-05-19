import { html, render } from "https://esm.sh/lit-html@3.3.0"
import "https://esm.sh/adorable-css@1.6.2"

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

const rand =
(a: number, b: number) =>
    Math.random()*(b-a)+a

const arr =
(n: number) =>
    new Array(n)
        .fill(void 0)
        .map((_, i) => i)

const randInt =
(a: number, b: number) =>
    Math.floor(rand(a, b))

const tuple =
<T extends unknown[]>
(...args: T) =>
    args

const max =
<A>
(as: A[]) =>
(d: (a: A) => number) => {
    let max = -Infinity
    let maxI = -1
    as.forEach((a, i) => {
        const curr = d(a)
        if (curr > max) {
            max = curr
            maxI = i
        }
    })
    return as[maxI]
}

interface XY { x: number, y: number }

const d =
(a: XY) => (b: XY) =>
    Math.hypot(b.x-a.x, b.y-a.y)

const divInt =
(a: number, b: number) =>
    tuple(a%b, Math.floor(a/b))

const dirs = [[0,1],[0,-1],[-1,0],[1,0]]

class Firm {
    world
    accessor x = randInt(0, 100)
    y = randInt(0, 100)
    price = 10
    constructor(world: World) {
        this.world = world
    }
    calcProfit(world: World) {
        return world.getChosenFirms()
            .filter(x => x == this)
            .length * this.price
    }
    get changePos() {
        const [dx, dy] = max(dirs)(this.try(([dx, dy]) => {
            this.x += dx
            this.y += dy
            return this.calcProfit(this.world)
        }))
        return () => {
            this.x += dx
            this.y += dy
        }
    }
    get changePrice() {
        const dp = max([1, -1])(this.try(dp => {
            this.price += dp
            return this.calcProfit(this.world)
        }))
        return () => {
            this.price += dp
        }
    }
    try<T, Args extends unknown[]>(f: (this: this, ...args: Args) => T) {
        return (...args: Args) => {
            const { x, y, price } = this
            const res = f.call(this, ...args)
            this.x = x
            this.y = y
            this.price = price
            return res
        }
    }
}

class Consumer {
    x
    y

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    choose(
        firms: Firm[],
        cost: (firm: Firm, consumer: Consumer) => number,
    ) {
        return max(firms)(firm => firm.price+cost(firm, this))
    }
}

class World {
    width
    height
    firms
    consumers

    constructor(width = 100, height = 100) {
        this.width = width
        this.height = height
        this.firms = arr(10).map(() => new Firm(this))
        this.consumers = arr(this.width*this.height)
            .map(i => new Consumer(...divInt(i, this.width)))
    }
    transportationCost(firm: Firm, consumer: Consumer) {
        return d(firm)(consumer)
    }
    getChosenFirms() {
        return this.consumers.map(consumer =>
            consumer.choose(
                this.firms, 
                this.transportationCost,
            )
        )
    }
    step() {
        const changes = this.firms.flatMap(firm => [
            firm.changePos,
            firm.changePrice,
        ])
        changes.forEach(change => change())
    }
    render(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width, this.height)

        this.firms.map(({ x, y }) => {
            ctx.fillStyle = "black"
            ctx.fillRect(x, y, 1, 1)
        })
    }
}

const ctx = $canvas.getContext("2d")!

const world = new World(100, 100)
while (true) {
    await tick()
    world.step()
    world.render(ctx)
}
