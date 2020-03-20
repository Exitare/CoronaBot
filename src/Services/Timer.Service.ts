export class TimerService {

  public static timers: Map<number, NodeJS.Timeout> = new Map();

  /**
   * Reschedules an event.
   * @param timerID the timerID
   * @param callFunction the function which should be called
   * @param interval the interval
   */
  public static async rescheduleTimer(timerID: number, callFunction: any, interval: number): Promise<void> {
    TimerService.timers.forEach((value: NodeJS.Timeout, key: number) => {
      if (key === timerID) {
        clearTimeout(value);
        // tslint:disable-next-line:no-null-keyword
        value = null!;
        TimerService.timers.delete(key);
      }
    });

    const timeout: NodeJS.Timeout = setTimeout(callFunction, interval);

    TimerService.timers.set(timerID, timeout);
    return;
  }
}
