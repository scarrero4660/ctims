import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AccessToken = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const headers = req.headers
        const authorization = headers['authorization']
        const token = authorization.replace('Bearer', '').trim()
        return token

    }
);
