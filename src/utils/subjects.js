import { ReplaySubject } from "rxjs";

export const resizeSubject$ = new ReplaySubject(1);
export const scrollSubject$ = new ReplaySubject(1);
