import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {distinctUntilChanged, Observable} from "rxjs";
import {Comparable} from "./comparable";

@Injectable()
export class DistinctUntilChangedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(distinctUntilChanged((prev: Comparable, curr: Comparable) => {
        return (prev && curr) && prev.isSame && prev.isSame(curr);
      }));
  }
}

