import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

const EntityNotFoundErrorPrefix = `Could not find any entity of type `;

@Injectable()
export class EntityNotFoundErrorInterceptor implements NestInterceptor {
  private changeErrorMessagePrefix(
    err: EntityNotFoundError,
  ): EntityNotFoundError {
    err.message = err.message
      .replace(EntityNotFoundErrorPrefix, '데이터를 찾을 수 없습니다 - ')
      .replace('matching', '조건')
      .replace(/\n|\s{2,}/g, '');

    return err;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundError) {
          return throwError(
            () => new NotFoundException(this.changeErrorMessagePrefix(err)),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
