export function numToIngicator(num: number) {
    const ingicatorSequence = [];
    const numarray = numArray(num);
    for (let i=0; i<numarray.length; i++){
        console.log(typeof numarray[i])
        if(typeof numarray[i] === "number"){
            const numIngi = numIngicator(numarray[i]);
            ingicatorSequence.push(numIngi);
        }
    }
    return ingicatorSequence;
}

export function numArray(num :number) {
    const sequence = [];
    const numString = num.toString()
    for (let i=0; i < numString.length; i++){
        sequence.push(Number(numString[i]))
    }
    return sequence;
}

export function numIngicator(num:number|undefined) { 
    switch (num) {
        case 0:
            return [1,0,1,1,1,1,1];
        case 1:
            return [0,0,0,0,1,0,1];
        case 2:
            return [1,1,1,0,1,1,0];
        case 3:
            return [1,1,1,0,1,0,1];
        case 4:
            return [0,1,0,1,1,0,1];
        case 5:
            return [1,1,1,1,0,0,1];
        case 6:
            return [1,1,1,1,0,1,1];
        case 7:
            return [0,0,1,1,1,0,1];
        case 8:
            return [1,1,1,1,1,1,1];
        case 9:
            return [0,1,1,1,1,0,1];
    }
}
