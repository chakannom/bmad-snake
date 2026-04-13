export type HudMessage = string;

export const formatRunningStatus = (stage: number): HudMessage => `상태: Stage ${stage} 진행중`;
export const formatPausedStatus = (stage: number): HudMessage => `상태: Stage ${stage} 일시정지`;
export const formatDeathStatus = (penaltyPercent: number, stage: number): HudMessage =>
  `상태: 사망(점수 -${penaltyPercent}%), Stage ${stage} 재도전`;
