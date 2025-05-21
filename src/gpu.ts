import "https://esm.sh/gpu.js@2.16.0/dist/gpu-browser"
declare const GPU: typeof import("https://esm.sh/gpu.js@2.16.0").GPU

import { XY } from "./util.ts"

const gpu = new GPU()

export const calcDists =
<T extends XY>
(width: number, height: number, targetsLength: number) => {
    console.log("create kernel", width, height, targetsLength)
    const dist = gpu.createKernel(
        function (ps: [number, number][]) {
            const x1 = ps[this.thread.z][0]
            const y1 = ps[this.thread.z][1]
            const x0 = this.thread.x
            const y0 = this.thread.y
            return (x1-x0)**2+(y1-y0)**2
        }
    ).setOutput([width, height, targetsLength])
    console.log("hi")
    return (targets: T[]) => {
        console.log("run kernel")
        const res = dist(targets.map(({ x, y }) => [x, y])) as Float32Array[][]

        const index = new Map<T, number>
        res.forEach((_, i) => index.set(targets[i], i))

        const d =
        (target: T, { x, y }: XY) =>
            res[index.get(target)!][x][y]

        return d
    }
}