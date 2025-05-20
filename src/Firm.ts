import { range, randInt, max } from "./util.ts"
import { World } from "./World.ts"

const dirs = [[0,1],[0,-1],[-1,0],[1,0]]

export class Firm {
    world

    @range(0, 99)
    accessor x = randInt(0, 100)

    @range(0, 99)
    accessor  y = randInt(0, 100)

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
