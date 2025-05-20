import { Consumer } from "./Consumer.ts"
import { Firm } from "./Firm.ts"
import { arr, divInt, d } from "./util.ts"

export class World {
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
