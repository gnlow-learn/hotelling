export const rand =
(a: number, b: number) =>
    Math.random()*(b-a)+a

export const arr =
(n: number) =>
    new Array(n)
        .fill(void 0)
        .map((_, i) => i)

export const randInt =
(a: number, b: number) =>
    Math.floor(rand(a, b))

export const tuple =
<T extends unknown[]>
(...args: T) =>
    args

export const max =
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

export const min =
<A>
(as: A[]) =>
(d: (a: A) => number) =>
    max(as)(a => -d(a))

export interface XY { x: number, y: number }

export const d =
(a: XY, b: XY) =>
    Math.hypot(b.x-a.x, b.y-a.y)

export const divInt =
(a: number, b: number) =>
    tuple(a%b, Math.floor(a/b))

export const accessorDecorator =
<Args extends unknown[], This, Return>
(f: (...args: Args) => { getV(v: Return): Return, setV(v: Return): Return }) =>
(...args: Args) => function (
    this: This,
    { get, set }: ClassAccessorDecoratorTarget<This, Return>,
) {
    const { getV, setV } = f(...args)
    return {
        get(this: This) {
            return getV(get.call(this))
        },
        set(this: This, newValue: Return) {
            set.call(this, setV(newValue))
        },
    }
}

export const range = accessorDecorator(
    (min: number, max: number) => ({
        getV: (v: number) => v,
        setV: (v: number) => Math.max(min, Math.min(v, max)),
    })
)
