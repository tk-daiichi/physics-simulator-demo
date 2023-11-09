const width = window.innerWidth;
const height = window.innerHeight;

export type StageConfig = {
    width: number,
    height: number,
    draggable?: boolean,
}
export const stage_cfg: StageConfig = { 
    width: width * 0.5, 
    height: height * 0.7,
    draggable: true, 
};