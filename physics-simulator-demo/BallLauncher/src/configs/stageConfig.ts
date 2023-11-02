const width = window.innerWidth;
const height = window.innerHeight;

export type StageConfig = {
    width: number,
    height: number
}
export const stage_cfg: StageConfig = { 
    width: width * 0.5, 
    height: height * 0.7 
};