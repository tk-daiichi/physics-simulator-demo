// y={{ graph1aParam(graph1a) }}x{{ graph1bParam(graph1b) }}
export const graph1Eq = (a: number, b: number) => {
    if (a == 0){
        return "";
    } else {
        return `y=${a1(a)}x${b1(b)}`;
    }
}
const a1 = ((a: number) => {
    const sign = (a >= 0) ? "" : "-"
    if(a !== 0){
        return Math.abs(a) == 1 ? sign : sign + Math.abs(a)
    } else {
        return "";
    }
})
const b1 = ((b: number) => {
    const sign = (b > 0) ? "+" : "-"
    return !!(b) ?  sign + Math.abs(b) : ""
})


// y={{ graph2aParam(graph2a) }}(x-{{ graph2b }})<sup>2</sup>{{ graph2c }}
export const graph2Eq = (a: number, b: number, c: number) => {
    if (a == 0) {
        return ""
    } else {
        return `y=${a2(a)}${b2(b)}<sup>2</sup>${c2(c)}`
    }
}
const a2 = ((a: number) => {
    const sign = (a >= 0) ? "" : "-"
    if(a == 0) {
        return ""
    } else if(Math.abs(a) == 1) {
        return sign;
    } else {
        return sign + Math.abs(a);
    }
})
const b2 = ((b: number) => {
    const sign = (b >= 0) ? "-" : "+"
    if(b == 0) {
        return "x"
    } else {
        return "(x" + sign + Math.abs(b) + ")";
    }
})
const c2 = ((c: number) => {
    const sign = (c >= 0) ? "+" : "-"
    if(c == 0) {
        return ""
    } else {
        return sign + Math.abs(c);
    }
})
