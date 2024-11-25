import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
    private readonly logger = new Logger(ExceptionFilter.name); // Scoped logger to the filter

    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        this.logger.error('RPC Exception caught', exception.message, exception.stack);
        return throwError(() => exception.getError());
    }
}