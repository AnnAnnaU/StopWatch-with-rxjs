import React from "react";
import { useEffect, useState } from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, map, buffer, debounceTime, filter } from "rxjs/operators";

import './App.css';

export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec(val => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);


  const start = React.useCallback(() => {
    setStatus("run");
  }, []);

  const stop = React.useCallback(() => {
    setStatus("stop");
    setSec(0);
  }, []);

  const reset = React.useCallback(() => {
    setSec(0);
  }, []);

  const wait = React.useCallback(() => {

    const mouse$ = fromEvent(document, 'click')

    const buff$ = mouse$.pipe(
      debounceTime(300),
    )

    const click$ = mouse$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    )

    click$.subscribe(() => {
      setStatus("wait");
    })
  }, []);

  return (
    <div className="stopWatch">
      <div>{new Date(sec).toISOString().slice(11, 19)}</div>
      <button className="start-button" onClick={start}>
        Start
      </button>
      <button className="stop-button" onClick={stop}>
        Stop
      </button>
      <button className="reset-button" onClick={reset}>Reset</button>
      <button className="wait-button" onClick={wait}>Wait</button>
    </div>
  );
}