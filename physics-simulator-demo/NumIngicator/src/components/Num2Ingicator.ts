export function numToIngicator(num: number[]): number[][] {
    const ingicatorSequence: number[][] = [];
    if(num.length != 0){
        for (let i = 0; i < num.length; i++){
            ingicatorSequence.push(numIngicator(num[i]));
        }
        return ingicatorSequence;
    } else {
        ingicatorSequence.push(numIngicator(0));
        return ingicatorSequence
    }
}

export function numIngicator(num:number): number[] { 
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
        default:
            return []
    }
}
