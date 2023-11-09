import { CircleConfig } from "./circleConfig";

export type GraphTrack = {
        points: any[],
        stroke: string,
        strokeWidth: number,
        config: CircleConfig,
        velocity: number,
}