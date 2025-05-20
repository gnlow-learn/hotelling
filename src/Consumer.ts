import { Firm } from "./Firm.ts"
import { min } from "./util.ts"

export class Consumer {
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
        return min(firms)(firm => firm.price+cost(firm, this))
    }
}
